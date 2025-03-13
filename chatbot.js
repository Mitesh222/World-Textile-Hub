document.addEventListener("DOMContentLoaded", function () {
    async function sendMessage() {
        const userInput = document.getElementById("user-message").value.trim();
        if (!userInput) return;

        const chatMessages = document.getElementById("chat-messages");
        chatMessages.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;

        try {
            const response = await fetch("http://127.0.0.1:5000/chat", {  // Change this to your live API URL when deployed
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userInput })
            });

            const data = await response.json();
            chatMessages.innerHTML += `<p><strong>Bot:</strong> ${data.reply}</p>`;
        } catch (error) {
            chatMessages.innerHTML += `<p><strong>Bot:</strong> Error connecting to chatbot.</p>`;
        }

        document.getElementById("user-message").value = "";
    }

    document.getElementById("user-message").addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
});
