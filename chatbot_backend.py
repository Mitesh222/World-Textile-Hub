from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# Load OpenAI API key securely
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("Missing OpenAI API key. Set it in your environment variables.")

client = openai.OpenAI(api_key=OPENAI_API_KEY)  # ✅ Correct OpenAI initialization

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        user_message = data.get("message", "")

        if not user_message:
            return jsonify({"error": "Message is required"}), 400

        # ✅ Correct OpenAI API call for version 1.0.0+
        response = client.chat.completions.create(
            model="gpt-4",  # Use "gpt-3.5-turbo" if GPT-4 is unavailable
            messages=[
                {"role": "system", "content": "You are a helpful assistant for the textile industry."},
                {"role": "user", "content": user_message}
            ]
        )

        chatbot_reply = response.choices[0].message.content
        return jsonify({"reply": chatbot_reply})

    except openai.OpenAIError as e:
        return jsonify({"error": f"OpenAI API error: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
