// Wait for the DOM to load completely before adding event listeners
document.addEventListener('DOMContentLoaded', function () {
    // Get all the navigation list items
    let items = document.querySelectorAll('.nav-icons li');

    // Set event listener for each list item to change the active state
    items.forEach(item => {
        item.addEventListener('click', function () {
            // Remove 'active' class from all list items
            items.forEach(i => i.classList.remove('active'));

            // Add 'active' class to the clicked item
            item.classList.add('active');

            // Call the relevant function based on the clicked item
            if (item.textContent.trim() === "Chat") {
                showChat();
            } else if (item.textContent.trim() === "Voice Chat") {
                showVoiceChat();
            } else if (item.textContent.trim() === "History") {
                showHistory();
            } else if (item.textContent.trim() === "Data Source") {
                showDataSource();
            } else if (item.textContent.trim() === "About Us") {
                showAboutUs();
            }
        });
    });
});

function showVoiceChat() {
    // Hide main content and show voice chat content
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('voice-chat-content').style.display = 'flex';
    document.getElementById('data-source-content').style.display = 'none';
    document.getElementById('about-us-content').style.display = 'none';
    document.getElementById('history-content').style.display = 'none';
    document.getElementById('details-content').style.display = 'none';
}

function showChat() {
    // Hide voice chat content and show main content
    document.getElementById('main-content').style.display = 'flex';
    document.getElementById('voice-chat-content').style.display = 'none';
    document.getElementById('data-source-content').style.display = 'none';
    document.getElementById('about-us-content').style.display = 'none';
    document.getElementById('history-content').style.display = 'none';
    document.getElementById('details-content').style.display = 'none';
}

function showHistory() {
    // Hide voice chat content and show main content
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('voice-chat-content').style.display = 'none';
    document.getElementById('data-source-content').style.display = 'none';
    document.getElementById('about-us-content').style.display = 'none';
    document.getElementById('history-content').style.display = 'flex';
    document.getElementById('details-content').style.display = 'none';
}

function showDataSource() {
    // Hide voice chat content and show main content
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('voice-chat-content').style.display = 'none';
    document.getElementById('data-source-content').style.display = 'flex';
    document.getElementById('about-us-content').style.display = 'none';
    document.getElementById('history-content').style.display = 'none';
    document.getElementById('details-content').style.display = 'none';
}

function showAboutUs() {
    // Hide voice chat content and show main content
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('voice-chat-content').style.display = 'none';
    document.getElementById('data-source-content').style.display = 'none';
    document.getElementById('about-us-content').style.display = 'flex';
    document.getElementById('history-content').style.display = 'none';
    document.getElementById('details-content').style.display = 'none';
}

// Add event listener for the send button
document.getElementById('send-button').addEventListener('click', async () => {
    sendMessage();
});

// Add event listener for the Enter key
document.getElementById('user-input').addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default Enter key behavior (e.g., form submission)
        sendMessage();
    }
});

// Function to send the message
async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (!userInput) return;

    // Display user message (right side)
    const messages = document.getElementById('messages');
    const userMessage = document.createElement('div');
    userMessage.textContent = `${userInput}`;
    userMessage.classList.add('user-message');
    messages.appendChild(userMessage);

    const welcomeMessage = document.getElementById('welcome-message');
    
    // Remove the welcome message if it exists
    if (welcomeMessage) {
        welcomeMessage.style.display = 'none';
    }

    // Clear input field
    document.getElementById('user-input').value = '';

    // Step 1: Show loading message immediately
    const loadingMessage = document.createElement('div');
    loadingMessage.classList.add('loading-message');
    loadingMessage.textContent = '🤌🏻 ... بلاتي';
    messages.appendChild(loadingMessage);

    // Scroll to the bottom of the chat to show new messages
    messages.scrollTop = messages.scrollHeight;

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
            // Clean the response by removing leading whitespace or newlines
            let cleanedResponse = data.response.trim();  // Removes leading and trailing whitespace/newlines
            
            // Replace multiple consecutive <br> tags with just one <br>
            cleanedResponse = cleanedResponse.replace(/<br\s*\/?>\s*<br\s*\/?>+/g, '<br>');
        
            // Set the cleaned response as the inner HTML
            botMessage.innerHTML = cleanedResponse;
        
            botMessage.classList.add('bot-message');
            botMessage.setAttribute('dir', 'rtl'); // Arabic direction
            botMessage.style.direction = 'rtl';  // Ensures right-to-left display
            botMessage.style.textAlign = 'right';  // Aligns text to the right
        } else {
            botMessage.textContent = `Error: ${data.error}`;
            botMessage.classList.add('error-message');
        }

        // Step 2: Remove the loading message and append bot's response
        messages.removeChild(loadingMessage);
        messages.appendChild(botMessage);

    } catch (error) {
        const errorMessage = document.createElement('div');
        errorMessage.textContent = 'Error: Unable to connect to the chatbot API.';
        errorMessage.classList.add('error-message');
        messages.appendChild(errorMessage);

        // Remove the loading message in case of an error
        messages.removeChild(loadingMessage);
    }

    // Scroll to the bottom of the chat
    messages.scrollTop = messages.scrollHeight;
}


let isRecording = false;
let mediaRecorder;
let audioChunks = [];
let audioBlob;
let audioUrl;
let audio;

// Function to start or stop recording
function toggleRecording() {
    if (isRecording) {
        // Stop recording
        mediaRecorder.stop();
        document.getElementById('record-btn').innerHTML = "🎙️"; // Change button back
    } else {
        // Start recording
        startRecording();
        document.getElementById('record-btn').innerHTML = "⏹️"; // Change button to stop icon
    }
    isRecording = !isRecording;
}

// Start recording function
function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };
            mediaRecorder.onstop = () => {
                audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                audioUrl = URL.createObjectURL(audioBlob);
                audio = new Audio(audioUrl);
                audioChunks = [];

                // Save the audio as MP3
                saveAudio();
            };
            mediaRecorder.start();
        })
        .catch(error => {
            console.error("Error accessing microphone: ", error);
        });
}

// Save the recorded audio as MP3
function saveAudio() {
    // Create a link to download the recorded audio as MP3
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = 'recording.mp3';
    link.click();
}