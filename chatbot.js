document.addEventListener("DOMContentLoaded", function () {
<<<<<<< HEAD
    // Toggle chatbot visibility
    window.toggleChat = function () {
        const chatContainer = document.getElementById("chat-container");
        chatContainer.style.display = (chatContainer.style.display === "none" || chatContainer.style.display === "") ? "flex" : "none";
    };

    // Send message to chatbot API
    window.sendMessage = async function () {
=======
    async function sendMessage() {
>>>>>>> c4ccc73ba556e52000e9ba54ec40400593e9e413
        const userInput = document.getElementById("user-message").value.trim();
        if (!userInput) return;

        const chatMessages = document.getElementById("chat-messages");
        chatMessages.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;

        try {
<<<<<<< HEAD
            const response = await fetch("https://world-textile-hub.onrender.com/chat", {  
=======
            const response = await fetch("https://world-textile-hub.onrender.com/chat", { // Change this to your live API URL when deployed
>>>>>>> c4ccc73ba556e52000e9ba54ec40400593e9e413
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userInput })
            });

            const data = await response.json();
<<<<<<< HEAD
            
            if (data.reply) {
                chatMessages.innerHTML += `<p><strong>Bot:</strong> ${data.reply}</p>`;
            } else {
                chatMessages.innerHTML += `<p><strong>Bot:</strong> Error: No response received.</p>`;
            }
=======
            chatMessages.innerHTML += `<p><strong>Bot:</strong> ${data.reply}</p>`;
>>>>>>> c4ccc73ba556e52000e9ba54ec40400593e9e413
        } catch (error) {
            chatMessages.innerHTML += `<p><strong>Bot:</strong> Error connecting to chatbot.</p>`;
        }

        document.getElementById("user-message").value = "";
<<<<<<< HEAD
    };

    // Allow "Enter" key to send message
=======
    }

>>>>>>> c4ccc73ba556e52000e9ba54ec40400593e9e413
    document.getElementById("user-message").addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
});
