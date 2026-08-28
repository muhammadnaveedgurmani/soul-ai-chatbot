# faqs.py
# SOUL Knowledge Base — AI Concepts + CodeAlpha Internship FAQs

FAQS = [
    # ================= ARTIFICIAL INTELLIGENCE - BASICS =================
    {
        "question": "What is Artificial Intelligence?",
        "answer": "Artificial Intelligence (AI) is the simulation of human intelligence in machines. It enables computers to learn, reason, solve problems, understand language, and make decisions — mimicking cognitive functions like a human brain."
    },
    {
        "question": "What is Machine Learning?",
        "answer": "Machine Learning (ML) is a subset of AI where computers learn patterns from data instead of being explicitly programmed. The system improves its performance automatically through experience (data) over time."
    },
    {
        "question": "What is Deep Learning?",
        "answer": "Deep Learning is a subset of Machine Learning that uses multi-layered artificial neural networks to automatically learn complex patterns from large amounts of data — commonly used in image recognition, speech, and NLP."
    },
    {
        "question": "What is the difference between AI, ML, and Deep Learning?",
        "answer": "AI is the broad concept of machines simulating human intelligence. ML is a technique within AI where systems learn from data. Deep Learning is a specialized subfield of ML that uses layered neural networks for complex tasks. Think of it as: AI > ML > Deep Learning (each is a subset of the previous)."
    },
    {
        "question": "What is Generative AI?",
        "answer": "Generative AI refers to AI systems that can create new content — text, images, music, code, or video — rather than just analyzing existing data. Examples include ChatGPT (text), DALL-E/Midjourney (images), and AI music generators."
    },
    {
        "question": "What is Agentic AI?",
        "answer": "Agentic AI refers to AI systems that can act autonomously — making decisions, planning multi-step tasks, using tools, and taking actions to achieve a goal with minimal human supervision. Unlike simple chatbots, AI agents can reason, plan, and execute tasks independently."
    },
    {
        "question": "What is Natural Language Processing?",
        "answer": "Natural Language Processing (NLP) is a branch of AI that helps computers understand, interpret, and generate human language — used in chatbots, translation tools, sentiment analysis, and voice assistants."
    },
    {
        "question": "What is a Neural Network?",
        "answer": "A Neural Network is a computing system inspired by the human brain's structure. It consists of layers of interconnected 'neurons' (nodes) that process data and learn patterns through training, forming the foundation of Deep Learning."
    },
    {
        "question": "What is supervised learning?",
        "answer": "Supervised Learning is a type of Machine Learning where the model is trained on labeled data (input-output pairs). The model learns to map inputs to correct outputs, like classifying emails as spam or not spam."
    },
    {
        "question": "What is unsupervised learning?",
        "answer": "Unsupervised Learning is a type of Machine Learning where the model finds hidden patterns or groupings in unlabeled data, without predefined correct answers. Clustering and anomaly detection are common examples."
    },
    {
        "question": "What is reinforcement learning?",
        "answer": "Reinforcement Learning is a type of Machine Learning where an agent learns to make decisions by interacting with an environment and receiving rewards or penalties for its actions — used in robotics, gaming AI, and self-driving cars."
    },
    {
        "question": "What is Computer Vision?",
        "answer": "Computer Vision is a field of AI that enables machines to interpret and understand visual information from the world, such as images and videos — used in face recognition, object detection, and medical imaging."
    },
    {
        "question": "What is a Large Language Model?",
        "answer": "A Large Language Model (LLM) is a type of deep learning model trained on massive amounts of text data to understand and generate human-like language. Examples include GPT-4, Gemini, and Claude."
    },
    {
        "question": "What is overfitting in Machine Learning?",
        "answer": "Overfitting occurs when a Machine Learning model learns the training data too well — including its noise and outliers — causing it to perform poorly on new, unseen data."
    },
    {
        "question": "What is a chatbot?",
        "answer": "A chatbot is an AI-powered software application designed to simulate human conversation through text or voice, often used for customer support, FAQs, and virtual assistance — like me, SOUL!"
    },
    {
        "question": "What is cosine similarity?",
        "answer": "Cosine similarity is a technique used to measure how similar two pieces of text are, by calculating the angle between their vector representations. It's commonly used in chatbots and search engines to match user queries with relevant content."
    },
    {
        "question": "What is a dataset in Machine Learning?",
        "answer": "A dataset is a structured collection of data used to train and evaluate Machine Learning models. It typically contains input features and, in supervised learning, corresponding output labels."
    },
    {
        "question": "What is the role of Python in AI?",
        "answer": "Python is the most widely used programming language in AI and Machine Learning due to its simplicity and powerful libraries like TensorFlow, PyTorch, scikit-learn, and NLTK."
    },

    # ================= CODEALPHA INTERNSHIP =================
    {
        "question": "What is CodeAlpha?",
        "answer": "CodeAlpha is a software development company offering internship programs across various domains including Artificial Intelligence, Web Development, and more — providing hands-on, real-world project experience to students."
    },
    {
        "question": "What is the CodeAlpha AI internship about?",
        "answer": "The CodeAlpha AI internship offers hands-on experience in AI model development, machine learning workflows, and real-time data processing. Interns work on real-world projects with mentorship support."
    },
    {
        "question": "How many tasks do I need to complete for the CodeAlpha internship?",
        "answer": "You are required to complete at least 3 out of the 4 available AI tasks: Language Translation Tool, Chatbot for FAQs, Music Generation with AI, and Object Detection & Tracking."
    },
    {
        "question": "What are the AI internship tasks in CodeAlpha?",
        "answer": "There are 4 tasks: 1) Language Translation Tool, 2) Chatbot for FAQs, 3) Music Generation with AI, and 4) Object Detection and Tracking. You must complete at least 3 of them."
    },
    {
        "question": "What is Task 1 in the CodeAlpha AI internship?",
        "answer": "Task 1 is the Language Translation Tool — build a UI where users enter text, select source/target languages, and get translated output using an API like Google Translate."
    },
    {
        "question": "What is Task 2 in the CodeAlpha AI internship?",
        "answer": "Task 2 is the Chatbot for FAQs — build a chatbot that matches user questions to a predefined FAQ list using NLP techniques like cosine similarity, and returns the best matching answer."
    },
    {
        "question": "What is Task 3 in the CodeAlpha AI internship?",
        "answer": "Task 3 is Music Generation with AI — train a deep learning model (like LSTM or GAN) on MIDI music data to generate new music sequences."
    },
    {
        "question": "What is Task 4 in the CodeAlpha AI internship?",
        "answer": "Task 4 is Object Detection and Tracking — use OpenCV and pretrained models like YOLO to detect and track objects in real-time video, drawing bounding boxes and tracking IDs."
    },
    {
        "question": "What perks does CodeAlpha internship offer?",
        "answer": "CodeAlpha offers a Completion Certificate (QR Verified), a Unique ID Certificate, a Letter of Recommendation based on performance, and Job Opportunities for top performers."
    },
    {
        "question": "What is the CodeAlpha website?",
        "answer": "The official CodeAlpha website is www.codealpha.tech"
    },
    {
        "question": "Do I need to submit my internship projects on GitHub?",
        "answer": "Yes, it's highly recommended to push your completed projects to GitHub with proper documentation (README.md) — this showcases your work professionally and is often required for submission."
    },
    {
        "question": "Who created SOUL?",
        "answer": "SOUL was designed and built by Muhammad Naveed Gurmani as part of Task 2 of the CodeAlpha Artificial Intelligence Internship — a next-generation FAQ chatbot combining AI concepts with internship guidance."
    },
]
