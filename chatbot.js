document.addEventListener("DOMContentLoaded", function () {
    // Toggle chatbot visibility
    window.toggleChat = function () {
        const chatContainer = document.getElementById("chat-container");
        chatContainer.style.display = (chatContainer.style.display === "none" || chatContainer.style.display === "") ? "flex" : "none";
    };

    // Send message to chatbot API
    window.sendMessage = async function () {
        const userInput = document.getElementById("user-message").value.trim();
        if (!userInput) return;

        const chatMessages = document.getElementById("chat-messages");
        chatMessages.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;

        try {
            const response = await fetch("https://world-textile-hub.onrender.com/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userInput })
            });

            const data = await response.json();

            if (data.reply) {
                chatMessages.innerHTML += `<p><strong>Bot:</strong> ${data.reply}</p>`;
            } else {
                chatMessages.innerHTML += `<p><strong>Bot:</strong> Error: No response received.</p>`;
            }
        } catch (error) {
            chatMessages.innerHTML += `<p><strong>Bot:</strong> Error connecting to chatbot.</p>`;
        }

        document.getElementById("user-message").value = "";
    };

    // Allow "Enter" key to send message
    document.getElementById("user-message").addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
});
