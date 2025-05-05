document.addEventListener("DOMContentLoaded", function () {
    const chatContainer = document.getElementById("chat-container");
    const chatMessages = document.getElementById("chat-messages");
    const userInputField = document.getElementById("user-message");

    // Toggle chatbot visibility
    window.toggleChat = function () {
        const isHidden = (chatContainer.style.display === "none" || chatContainer.style.display === "");
        chatContainer.style.display = isHidden ? "flex" : "none";

        if (isHidden) {
            // Scroll to bottom on open
            setTimeout(() => chatMessages.scrollTop = chatMessages.scrollHeight, 100);
        }
    };

    // Send message to chatbot API
    window.sendMessage = async function () {
        const userInput = userInputField.value.trim();
        if (!userInput) return;

        appendMessage("You", userInput);
        userInputField.value = "";

        try {
            const response = await fetch("https://world-textile-hub.onrender.com/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userInput })
            });

            const data = await response.json();

            if (data.reply) {
                appendMessage("Bot", data.reply);
            } else {
                appendMessage("Bot", "⚠️ No response received.");
            }
        } catch (error) {
            appendMessage("Bot", "❌ Error connecting to chatbot.");
        }
    };

    // Append messages
    function appendMessage(sender, message) {
        const p = document.createElement("p");
        p.innerHTML = `<strong>${sender}:</strong> ${escapeHtml(message)}`;
        chatMessages.appendChild(p);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Escape HTML to prevent injection
    function escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    // "Enter" key to send
    userInputField.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    });

    // Optional: Show welcome message
    appendMessage("Bot", "👋 Hello! Ask me anything about textiles.");
});
