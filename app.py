# app.py
# SOUL — AI & Internship Knowledge Assistant
# Backend: Flask + Scikit-learn (TF-IDF + Cosine Similarity)

from flask import Flask, render_template, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from faqs import FAQS

app = Flask(__name__)

# ---------------------------------------------------------
# STEP 1: Prepare data — extract all questions from FAQs
# ---------------------------------------------------------
questions = [faq["question"] for faq in FAQS]
answers = [faq["answer"] for faq in FAQS]

# ---------------------------------------------------------
# STEP 2: Train TF-IDF Vectorizer on our FAQ questions
# This converts text into numerical vectors so we can
# mathematically compare similarity between sentences.
# ---------------------------------------------------------
vectorizer = TfidfVectorizer(stop_words="english")
faq_vectors = vectorizer.fit_transform(questions)

# ---------------------------------------------------------
# STEP 3: Core AI/ML Function — Find best matching FAQ
# ---------------------------------------------------------
def get_best_match(user_question):
    if not user_question.strip():
        return {
            "answer": "Please type a question so I can help you!",
            "confidence": 0,
            "matched_question": None
        }

    # Convert user's question into the same vector space
    user_vector = vectorizer.transform([user_question])

    # Calculate cosine similarity between user question and all FAQ questions
    similarities = cosine_similarity(user_vector, faq_vectors)[0]

    # Find the index of the highest similarity score
    best_index = similarities.argmax()
    best_score = similarities[best_index]

    # Confidence threshold — if similarity too low, admit uncertainty
    CONFIDENCE_THRESHOLD = 0.25

    if best_score < CONFIDENCE_THRESHOLD:
        return {
            "answer": "Hmm, I'm not fully sure about that one 🤔. Could you rephrase your question, or ask me something about AI concepts (like Machine Learning, Generative AI, Agentic AI) or the CodeAlpha internship?",
            "confidence": round(float(best_score) * 100, 1),
            "matched_question": None
        }

    return {
        "answer": answers[best_index],
        "confidence": round(float(best_score) * 100, 1),
        "matched_question": questions[best_index]
    }

# ---------------------------------------------------------
# ROUTES
# ---------------------------------------------------------

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")

    result = get_best_match(user_message)

    return jsonify(result)

@app.route("/suggestions")
def suggestions():
    # Return a few sample questions for quick-suggestion chips
    sample_questions = [
        "What is Artificial Intelligence?",
        "What is Generative AI?",
        "What is Agentic AI?",
        "What are the CodeAlpha internship tasks?",
    ]
    return jsonify(sample_questions)

if __name__ == "__main__":
    app.run(debug=True)
