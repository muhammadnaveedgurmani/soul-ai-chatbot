// ============================================
// SOUL — AI Knowledge Assistant
// Frontend Logic: Chat, Typing Effect, Voice Controls, History, Particles
// ============================================

const chatWindow = document.getElementById("chatWindow");
const welcomeScreen = document.getElementById("welcomeScreen");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const micBtn = document.getElementById("micBtn");
const newChatBtn = document.getElementById("newChatBtn");
const themeToggle = document.getElementById("themeToggle");
const openSidebar = document.getElementById("openSidebar");
const closeSidebar = document.getElementById("closeSidebar");
const sidebar = document.getElementById("sidebar");
const suggestionGrid = document.getElementById("suggestionGrid");
const historyList = document.getElementById("historyList");
const emptyHistory = document.getElementById("emptyHistory");

let isWaitingForReply = false;
let currentChatId = null;
let currentChatMessages = []; // { sender, text, confidence }

// ============================================
// CHAT HISTORY — stored in localStorage
// ============================================
function getAllChats() {
    const data = localStorage.getItem("soul_chats");
    return data ? JSON.parse(data) : [];
}

function saveAllChats(chats) {
    localStorage.setItem("soul_chats", JSON.stringify(chats));
}

function generateChatId() {
    return "chat_" + Date.now();
}

// Save/update the current chat into history
function persistCurrentChat() {
    if (currentChatMessages.length === 0) return;

    let chats = getAllChats();
    const firstUserMsg = currentChatMessages.find(m => m.sender === "user");
    const title = firstUserMsg ? firstUserMsg.text.slice(0, 40) : "New chat";

    const existingIndex = chats.findIndex(c => c.id === currentChatId);
    const chatData = {
        id: currentChatId,
        title: title,
        messages: currentChatMessages,
        updatedAt: Date.now()
    };

    if (existingIndex >= 0) {
        chats[existingIndex] = chatData;
    } else {
        chats.unshift(chatData);
    }

    // Keep only latest 30 chats
    chats = chats.slice(0, 30);
    saveAllChats(chats);
    renderHistoryList();
}

function renderHistoryList() {
    const chats = getAllChats();
    historyList.innerHTML = "";

    if (chats.length === 0) {
        historyList.appendChild(emptyHistory);
        return;
    }

    chats.forEach(chat => {
        const item = document.createElement("div");
        item.className = "history-item" + (chat.id === currentChatId ? " active" : "");
        item.innerHTML = `
            <i class="fa-solid fa-message"></i>
            <span class="history-text">${escapeHtml(chat.title)}</span>
            <i class="fa-solid fa-trash delete-chat" title="Delete"></i>
        `;

        item.addEventListener("click", (e) => {
            if (e.target.classList.contains("delete-chat")) return;
            loadChat(chat.id);
        });

        item.querySelector(".delete-chat").addEventListener("click", (e) => {
            e.stopPropagation();
            deleteChat(chat.id);
        });

        historyList.appendChild(item);
    });
}

function deleteChat(chatId) {
    let chats = getAllChats();
    chats = chats.filter(c => c.id !== chatId);
    saveAllChats(chats);

    if (chatId === currentChatId) {
        startNewChat();
    } else {
        renderHistoryList();
    }
}

function loadChat(chatId) {
    const chats = getAllChats();
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;

    currentChatId = chat.id;
    currentChatMessages = [...chat.messages];

    // Clear chat window and rebuild
    chatWindow.innerHTML = "";
    if (chat.messages.length === 0) {
        chatWindow.appendChild(welcomeScreen);
        welcomeScreen.style.display = "flex";
    } else {
        chat.messages.forEach(msg => {
            renderStoredMessage(msg);
        });
    }

    renderHistoryList();
    sidebar.classList.remove("open");
}

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

// ============================================
// Load suggestion chips on start
// ============================================
async function loadSuggestions() {
    try {
        const res = await fetch("/suggestions");
        const questions = await res.json();
        const icons = ["fa-brain", "fa-wand-magic-sparkles", "fa-robot", "fa-briefcase"];

        suggestionGrid.innerHTML = questions.map((q, i) => `
            <button class="suggestion-card" data-question="${q}">
                <i class="fa-solid ${icons[i % icons.length]}"></i>${q}
            </button>
        `).join("");

        document.querySelectorAll(".suggestion-card").forEach(card => {
            card.addEventListener("click", () => {
                userInput.value = card.getAttribute("data-question");
                sendMessage();
            });
        });
    } catch (err) {
        console.error("Failed to load suggestions", err);
    }
}
// ============================================
// VOICE CONTROL SYSTEM (Play / Pause / Stop)
// ============================================
let activeSpeech = null; // { utterance, playBtn, text }

function stopAllSpeech() {
    speechSynthesis.cancel();
    if (activeSpeech && activeSpeech.playBtn) {
        resetVoiceButton(activeSpeech.playBtn);
    }
    activeSpeech = null;
}

function resetVoiceButton(btn) {
    btn.innerHTML = `<i class="fa-solid fa-play"></i> Listen`;
    btn.classList.remove("speaking");
}

function createVoiceControlButton(text) {
    const btn = document.createElement("button");
    btn.className = "voice-control-btn";
    btn.innerHTML = `<i class="fa-solid fa-play"></i> Listen`;

    btn.addEventListener("click", () => {
        const isThisSpeaking = activeSpeech && activeSpeech.playBtn === btn;

        if (isThisSpeaking) {
            // This message is the active one — toggle pause/resume
            if (speechSynthesis.speaking && !speechSynthesis.paused) {
                speechSynthesis.pause();
                btn.innerHTML = `<i class="fa-solid fa-play"></i> Resume`;
            } else if (speechSynthesis.paused) {
                speechSynthesis.resume();
                btn.innerHTML = `<i class="fa-solid fa-pause"></i> Pause`;
            }
            return;
        }

        // A different (or no) message is active — stop it and start this one
        stopAllSpeech();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        utterance.onend = () => {
            resetVoiceButton(btn);
            activeSpeech = null;
        };
        utterance.onerror = () => {
            resetVoiceButton(btn);
            activeSpeech = null;
        };

        activeSpeech = { utterance, playBtn: btn, text };
        btn.innerHTML = `<i class="fa-solid fa-pause"></i> Pause`;
        btn.classList.add("speaking");
        speechSynthesis.speak(utterance);
    });

    return btn;
}

// ============================================
// Add a message bubble to the chat window
// ============================================
function addMessage(text, sender) {
    if (welcomeScreen && welcomeScreen.parentNode === chatWindow) {
        welcomeScreen.style.display = "none";
    }

    const row = document.createElement("div");
    row.className = `message-row ${sender}`;

    const avatar = document.createElement("div");
    avatar.className = sender === "bot" ? "avatar bot-avatar" : "avatar user-avatar";
    if (sender === "bot") {
        avatar.innerHTML = `<img src="/static/soul-avatar.png" alt="SOUL">`;
    } else {
        avatar.innerHTML = `<i class="fa-solid fa-user"></i>`;
    }

    const bubble = document.createElement("div");
    bubble.className = "message-bubble";

    row.appendChild(avatar);
    row.appendChild(bubble);
    chatWindow.appendChild(row);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    return { row, avatar, bubble };
}

// Render a message instantly (used when loading chat history — no typing effect)
function renderStoredMessage(msg) {
    const { bubble } = addMessage(msg.text, msg.sender);
    bubble.textContent = msg.text;

    if (msg.sender === "bot") {
        const footer = document.createElement("div");
        footer.className = "bubble-footer";

        if (msg.confidence !== null && msg.confidence !== undefined) {
            const isLow = msg.confidence < 25;
            const badge = document.createElement("div");
            badge.className = `confidence-badge ${isLow ? "low" : ""}`;
            badge.innerHTML = `<i class="fa-solid fa-signal"></i> ${msg.confidence}%`;
            footer.appendChild(badge);
        }

        footer.appendChild(createVoiceControlButton(msg.text));
        bubble.appendChild(footer);
    }
}

// ============================================
// Typing indicator (animated dots)
// ============================================
function showTypingIndicator() {
    const { row, avatar, bubble } = addMessage("", "bot");
    avatar.classList.add("thinking");
    bubble.innerHTML = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
    return row;
}

// ============================================
// Typing effect — reveal text letter by letter
// ============================================
function typeText(element, text, speed = 12) {
    return new Promise(resolve => {
        let i = 0;
        element.textContent = "";
        const interval = setInterval(() => {
            element.textContent += text.charAt(i);
            chatWindow.scrollTop = chatWindow.scrollHeight;
            i++;
            if (i >= text.length) {
                clearInterval(interval);
                resolve();
            }
        }, speed);
    });
}

// ============================================
// Send message to backend & display response
// ============================================
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message || isWaitingForReply) return;

    isWaitingForReply = true;

    if (!currentChatId) {
        currentChatId = generateChatId();
    }

    const { bubble: userBubble } = addMessage("", "user");
    userBubble.textContent = message;
    currentChatMessages.push({ sender: "user", text: message, confidence: null });

    userInput.value = "";
    userInput.style.height = "auto";

    const typingRow = showTypingIndicator();

    try {
        const res = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: message })
        });
        const data = await res.json();

        typingRow.remove();

        const { bubble: botBubble } = addMessage("", "bot");
        await typeText(botBubble, data.answer, 12);

        const footer = document.createElement("div");
        footer.className = "bubble-footer";

        if (data.confidence !== null && data.confidence !== undefined) {
            const isLow = data.confidence < 25;
            const badge = document.createElement("div");
            badge.className = `confidence-badge ${isLow ? "low" : ""}`;
            badge.innerHTML = `<i class="fa-solid fa-signal"></i> ${data.confidence}%`;
            footer.appendChild(badge);
        }

        // Voice control button — user must click to hear it (NOT automatic)
        footer.appendChild(createVoiceControlButton(data.answer));
        botBubble.appendChild(footer);

        currentChatMessages.push({ sender: "bot", text: data.answer, confidence: data.confidence });
        persistCurrentChat();

    } catch (err) {
        typingRow.remove();
        const { bubble } = addMessage("", "bot");
        bubble.textContent = "Oops! Something went wrong connecting to SOUL's brain. Please try again.";
        console.error(err);
    }

    isWaitingForReply = false;
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

userInput.addEventListener("input", () => {
    userInput.style.height = "auto";
    userInput.style.height = Math.min(userInput.scrollHeight, 120) + "px";
});

// ============================================
// New Chat button
// ============================================
function startNewChat() {
    stopAllSpeech();
    persistCurrentChat(); // save previous chat before switching

    currentChatId = null;
    currentChatMessages = [];

    chatWindow.innerHTML = "";
    chatWindow.appendChild(welcomeScreen);
    welcomeScreen.style.display = "flex";

    renderHistoryList();
    sidebar.classList.remove("open");
}

newChatBtn.addEventListener("click", startNewChat);

// ============================================
// Sidebar quick-topic chips
// ============================================
document.querySelectorAll(".sidebar-chip").forEach(chip => {
    chip.addEventListener("click", () => {
        userInput.value = chip.getAttribute("data-question");
        sendMessage();
        sidebar.classList.remove("open");
    });
});

// ============================================
// Theme toggle (dark/light mode)
// ============================================
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    const icon = themeToggle.querySelector("i");
    icon.className = document.body.classList.contains("light-mode") ? "fa-solid fa-moon" : "fa-solid fa-sun";
});

// ============================================
// Mobile sidebar toggle
// ============================================
if (openSidebar) openSidebar.addEventListener("click", () => sidebar.classList.add("open"));
if (closeSidebar) closeSidebar.addEventListener("click", () => sidebar.classList.remove("open"));

// ============================================
// VOICE INPUT (Speech Recognition)
// ============================================
let recognition = null;
let isListening = false;

if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
        userInput.value = event.results[0][0].transcript;
        sendMessage();
    };
    recognition.onend = () => {
        isListening = false;
        micBtn.classList.remove("listening");
    };
    recognition.onerror = () => {
        isListening = false;
        micBtn.classList.remove("listening");
    };
} else {
    micBtn.style.opacity = "0.4";
    micBtn.title = "Voice input not supported in this browser";
}

micBtn.addEventListener("click", () => {
    if (!recognition) return;
    if (isListening) {
        recognition.stop();
        isListening = false;
        micBtn.classList.remove("listening");
    } else {
        recognition.start();
        isListening = true;
        micBtn.classList.add("listening");
    }
});

// ============================================
// PARTICLE BACKGROUND ANIMATION
// ============================================
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const particles = [];
const PARTICLE_COUNT = 60;

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 1.8 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.5 ? "123, 47, 247" : "0, 212, 255";
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.fill();
    }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ============================================
// INIT
// ============================================
loadSuggestions();
renderHistoryList();
