# 🔮 SOUL — AI & Internship Knowledge Assistant

<div align="center">

![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=flat-square&logo=flask&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=flat-square&logo=scikitlearn&logoColor=white)

</div>

A next-generation, futuristic AI chatbot that answers questions about **Artificial Intelligence concepts** (Machine Learning, Deep Learning, Generative AI, Agentic AI, NLP, etc.) and the **CodeAlpha Internship Program**. Built as **Task 2** of the CodeAlpha AI Internship.

## ✨ Features
- 🧠 **NLP-powered matching** using TF-IDF Vectorization + Cosine Similarity
- 💬 ChatGPT-style full-screen interface with persistent chat history (localStorage)
- ⌨️ Real-time typing animation for bot responses
- 🎤 Voice input (Speech Recognition)
- 🔊 Voice output with **Play / Pause / Resume** controls (not automatic)
- 📊 Confidence score badge on every answer
- 🌗 Dark / Light mode toggle
- ✨ Animated particle background + glowing orb avatar
- 📱 Fully responsive with mobile sidebar

## 🛠️ Tech Stack
- **Backend**: Python, Flask
- **AI/ML**: Scikit-learn (TfidfVectorizer, Cosine Similarity)
- **Frontend**: HTML5, CSS3 (custom animations), Vanilla JavaScript
- **Browser APIs**: Web Speech API (Recognition + Synthesis), Canvas API

## 🚀 How to Run Locally

```bash
git clone https://github.com/muhammadnaveedgurmanii-png/soul-ai-chatbot.git
cd soul-ai-chatbot
python -m venv venv
venv\Scripts\activate      # Windows
pip install -r requirements.txt
python app.py
