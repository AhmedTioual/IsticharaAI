document.getElementById('send-button').addEventListener('click', async () => {
    const userInput = document.getElementById('user-input').value;
    if (!userInput) return;

    // Display user message (right side)
    const messages = document.getElementById('messages');
    const userMessage = document.createElement('div');
    userMessage.textContent = `${userInput}`;
    userMessage.classList.add('user-message');
    messages.appendChild(userMessage);

    // Clear input field
    document.getElementById('user-input').value = '';

    // Call the backend API
    try {
        const response = await fetch('http://127.0.0.1:8000/api/chat/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userInput }), // Adjusted to use "message" key
        });

        const data = await response.json();
        const botMessage = document.createElement('div');
        if (response.ok) {
            botMessage.textContent = `${data.response}`; // Expecting "response" in the API output
            botMessage.classList.add('bot-message');
        } else {
            botMessage.textContent = `Error: ${data.error}`; // Handle error messages
            botMessage.classList.add('error-message');
        }
        messages.appendChild(botMessage);
    } catch (error) {
        const errorMessage = document.createElement('div');
        errorMessage.textContent = 'Error: Unable to connect to the chatbot API.';
        errorMessage.classList.add('error-message');
        messages.appendChild(errorMessage);
    }

    // Scroll to the bottom of the chat
    messages.scrollTop = messages.scrollHeight;
});
