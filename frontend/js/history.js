let messages = [];

// Function to add a message
function addMessage(message, sender = 'user') {
    const messageObject = {
        message: message,
        sender: sender,
        timestamp: new Date().toLocaleString()
    };
    messages.push(messageObject);
    saveMessages(); // Save to localStorage each time a message is added
}

// Function to save messages in localStorage
function saveMessages() {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
}

// Function to load messages from localStorage when the history section is accessed
function loadMessagesFromStorage() {
    const savedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    const historyContainer = document.getElementById('history-messages');
    historyContainer.innerHTML = ''; // Clear existing history

    savedMessages.forEach((messageObject) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(messageObject.sender);
        messageDiv.innerHTML = `
            <p><strong>${messageObject.sender === 'user' ? 'You' : 'Bot'}:</strong> ${messageObject.message}</p>
            <small>${messageObject.timestamp}</small>
        `;
        historyContainer.appendChild(messageDiv);
    });
}

// Call this function when the History section is displayed
document.getElementById('history').addEventListener('click', function() {
    loadMessagesFromStorage();
});

// Example of sending a message (you can replace this with your input logic)
document.getElementById('send-button').addEventListener('click', function() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim()) {
        addMessage(userInput, 'user');
        document.getElementById('user-input').value = ''; // Clear the input field
        // Add bot response (example)
        setTimeout(() => {
            addMessage("This is a bot response.", 'bot');
        }, 1000);
    }
});

// Optional: Automatically load messages when the page loads, for consistency
window.onload = function() {
    loadMessagesFromStorage();
};
