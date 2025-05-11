// Function to create and inject the AI button
function injectAIButton() {
    console.log('Attempting to inject AI button...');
    const controlsDiv = document.querySelector('div.query-editor-controls');
    console.log('Found controls div:', controlsDiv);

    if (!controlsDiv) {
        console.error('Query editor controls div not found!');
        return;
    }

    // Check if button already exists to prevent duplicates
    const existingButton = document.querySelector('button[data-test="AIButton"]');
    if (existingButton) {
        console.log('AI button already exists, skipping injection');
        return;
    }

    // Create button
    const aiButton = document.createElement('button');
    aiButton.className = 'ant-btn query-editor-controls-button m-l-5';
    aiButton.setAttribute('data-test', 'AIButton');
    aiButton.setAttribute('tooltip', 'Generate with AI');
    aiButton.innerHTML = '<i class="fa fa-flash" style="color: #ffd700;"></i>';
    aiButton.onclick = toggleChatPanel;

    console.log('Created AI button, appending to controls div...');
    controlsDiv.appendChild(aiButton);
    console.log('AI button injected successfully');
}

// Function to generate a unique chat session ID
function generateChatSessionId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Store the chat session ID at the module level if not already defined
if (typeof window.chatSessionId === 'undefined') {
    // Generate and make it available globally
    window.chatSessionId = generateChatSessionId();
    console.log('Generated new chat session ID');
} else {
    console.log('Chat session ID already defined, reusing existing ID');
}

// Function to create and inject the chat panel
function createChatPanel() {
    console.log('Creating chat panel...');

    // Check if panel already exists to prevent duplicates
    const existingPanel = document.getElementById('ai-chat-panel');
    if (existingPanel) {
        console.log('Chat panel already exists, skipping creation');
        return;
    }

    const panel = document.createElement('div');
    panel.id = 'ai-chat-panel';
    panel.className = 'ai-chat-panel hidden';

    panel.innerHTML = `
    <div class="chat-header">
      <h3>AI Query Generator</h3>
      <button class="close-btn">&times;</button>
    </div>
    <div class="chat-messages"></div>
    <div class="chat-input">
      <textarea placeholder="Describe what you want to query..."></textarea>
      <button class="send-btn">Send</button>
    </div>
  `;

    console.log('Appending chat panel to document body...');
    document.body.appendChild(panel);
    console.log('Chat panel created and appended successfully');

    // Add event listeners
    panel.querySelector('.close-btn').onclick = () => toggleChatPanel(false);
    panel.querySelector('.send-btn').onclick = sendMessage;

    // Add enter key support for textarea
    panel.querySelector('textarea').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
}

// Function to toggle chat panel visibility
function toggleChatPanel(show = true) {
    console.log('Toggling chat panel, show:', show);
    const panel = document.getElementById('ai-chat-panel');
    if (show) {
        panel.classList.remove('hidden');
    } else {
        panel.classList.add('hidden');
    }
    console.log('Chat panel toggled successfully');
}

// Loading states with transitions
// Define loadingStates if not already defined
if (typeof window.loadingStates === 'undefined') {
    window.loadingStates = [
        "Sending your request...",
        "Thinking about the best approach...",
        "Generating SQL query...",
        "Taking a bit more time to ensure accuracy...",
        "Analyzing the database schema...",
        "Crafting the perfect query...",
        "Double-checking the syntax...",
        "Almost there..."
    ];
    console.log('Defined loading states');
} else {
    console.log('Loading states already defined, reusing existing states');
}

// Function to get a random loading state (excluding the current one)
function getRandomLoadingState(currentState) {
    const availableStates = window.loadingStates.filter(state => state !== currentState);
    const randomIndex = Math.floor(Math.random() * availableStates.length);
    return availableStates[randomIndex];
}

// Function to get a random delay between state changes
function getRandomDelay() {
    return Math.floor(Math.random() * 2000) + 1500; // Random delay between 1.5 and 3.5 seconds
}

// Initialize loading state variables if not already defined
if (typeof window.currentLoadingState === 'undefined') {
    window.currentLoadingState = '';
    console.log('Initialized currentLoadingState');
} else {
    console.log('currentLoadingState already defined, reusing existing variable');
}

if (typeof window.loadingInterval === 'undefined') {
    window.loadingInterval = null;
    console.log('Initialized loadingInterval');
} else {
    console.log('loadingInterval already defined, reusing existing variable');
}

// Function to show loading state
function showLoadingState() {
    const messagesContainer = document.querySelector('.chat-messages');
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message assistant loading';
    loadingDiv.id = 'loading-message';
    messagesContainer.appendChild(loadingDiv);

    // Start with a random state
    window.currentLoadingState = window.loadingStates[Math.floor(Math.random() * window.loadingStates.length)];
    loadingDiv.textContent = window.currentLoadingState;

    // Function to update loading state
    function updateLoadingState() {
        window.currentLoadingState = getRandomLoadingState(window.currentLoadingState);
        loadingDiv.textContent = window.currentLoadingState;

        // Schedule next update with random delay
        window.loadingInterval = setTimeout(updateLoadingState, getRandomDelay());
    }

    // Start the cycle with random delay
    window.loadingInterval = setTimeout(updateLoadingState, getRandomDelay());
}

// Function to remove loading state
function removeLoadingState() {
    const loadingDiv = document.getElementById('loading-message');
    if (loadingDiv) {
        loadingDiv.remove();
    }
    if (window.loadingInterval) {
        clearTimeout(window.loadingInterval);
        window.loadingInterval = null;
    }
}

// Function to add copy button to SQL code blocks
function addCopyButtons() {
    const codeBlocks = document.querySelectorAll('.message.assistant pre code.language-sql');
    codeBlocks.forEach(codeBlock => {
        // Check if button already exists
        if (codeBlock.parentElement.querySelector('.copy-query-btn')) {
            return;
        }

        const copyButton = document.createElement('button');
        copyButton.className = 'copy-query-btn';
        copyButton.innerHTML = '<i class="fa fa-copy"></i>';
        copyButton.title = 'Copy Query';
        copyButton.onclick = () => copyQuery(codeBlock.textContent);

        // Position the button
        codeBlock.parentElement.style.position = 'relative';
        copyButton.style.position = 'absolute';
        copyButton.style.bottom = '8px';
        copyButton.style.right = '8px';

        codeBlock.parentElement.appendChild(copyButton);
    });
}

// Function to copy query to clipboard
function copyQuery(query) {
    // Trim whitespace from the query
    const trimmedQuery = query.trim();

    // Copy to clipboard
    navigator.clipboard.writeText(trimmedQuery).then(() => {
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'copy-success-message';
        successMessage.textContent = 'Query copied to clipboard!';
        document.body.appendChild(successMessage);

        // Remove success message after 2 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy query:', err);
    });
}

// Function to show text line by line with fade-in
function showTextLineByLine(element, text, speed = 100) {
    // First, parse the markdown to HTML
    const htmlContent = marked.parse(text);

    // Create a temporary div to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    // Get all the top-level elements (p, pre, etc.)
    const elements = Array.from(tempDiv.children);
    let currentElement = 0;

    function showNextElement() {
        if (currentElement < elements.length) {
            // Create a new line element
            const lineElement = document.createElement('div');
            lineElement.className = 'fade-in-line';

            // Clone the element to preserve its structure
            const clonedElement = elements[currentElement].cloneNode(true);
            lineElement.appendChild(clonedElement);

            element.appendChild(lineElement);
            currentElement++;

            // Add copy buttons after each SQL code block is added
            setTimeout(() => {
                addCopyButtons();
            }, speed);

            setTimeout(showNextElement, speed);
        }
    }

    showNextElement();
}

// Function to send message to n8n workflow
async function sendMessage() {
    const textarea = document.querySelector('#ai-chat-panel textarea');
    const message = textarea.value.trim();
    if (!message) {
        console.log('Empty message, returning');
        return;
    }

    // Add user message to chat
    addMessageToChat('user', message);
    textarea.value = '';

    try {
        // Show loading state
        showLoadingState();

        // Create basic auth header if credentials are provided
        const headers = {
            'Content-Type': 'application/json',
            'chatSessionId': window.chatSessionId
        };

        if (window.config.N8N_USERNAME && window.config.N8N_PASSWORD) {
            const auth = btoa(`${window.config.N8N_USERNAME}:${window.config.N8N_PASSWORD}`);
            headers['Authorization'] = `Basic ${auth}`;
        }

        // Make API call to n8n using the URL from config
        const response = await fetch(window.config.N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                chatInput: message
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const markdownContent = data.output;

        // Remove loading state
        removeLoadingState();

        // Create new message div for line-by-line effect
        const messagesContainer = document.querySelector('.chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message assistant';
        messagesContainer.appendChild(messageDiv);

        // Show content line by line
        showTextLineByLine(messageDiv, markdownContent);
    } catch (error) {
        console.error('Error sending message:', error);
        removeLoadingState();
        addMessageToChat('assistant', 'Sorry, there was an error processing your request.');
    }
}

// Function to add message to chat UI
function addMessageToChat(role, content, isHtml = false) {
    console.log('Adding message to chat, role:', role);
    const messagesContainer = document.querySelector('.chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;

    if (isHtml) {
        messageDiv.innerHTML = content;
    } else {
        messageDiv.textContent = content;
    }

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    console.log('Message added successfully');
}

// Function to wait for an element to be available
function waitForElement(selector, callback) {
    console.log('Waiting for element:', selector);

    // First check if element already exists
    const element = document.querySelector(selector);
    if (element) {
        console.log('Element already exists');
        callback(element);
        return;
    }

    // If not, set up a MutationObserver
    const observer = new MutationObserver((mutations, obs) => {
        const element = document.querySelector(selector);
        if (element) {
            console.log('Element found through observer');
            obs.disconnect();
            callback(element);
        }
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Set a timeout to stop observing after 10 seconds
    setTimeout(() => {
        observer.disconnect();
        console.log('Observer timeout after 10 seconds');
    }, 10000);
}

// Initialize the extension
function init() {
    console.log('Initializing extension...');
    console.log('Current URL:', window.location.href);
    console.log('Page loaded, starting initialization');

    // Create chat panel immediately
    createChatPanel();

    // Wait for query editor controls to be available
    waitForElement('div.query-editor-controls', () => {
        console.log('Query editor controls found, injecting button');
        injectAIButton();
    });

    console.log('Extension initialization complete');
}

// Run initialization when the page is fully loaded
console.log('Content script loaded');
if (document.readyState === 'loading') {
    console.log('Document still loading, adding DOMContentLoaded listener');
    document.addEventListener('DOMContentLoaded', init);
} else {
    console.log('Document already loaded, running init directly');
    init();
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('Content script received message:', request);

    if (request.type === 'configUpdated') {
        window.config.N8N_WEBHOOK_URL = request.n8nWebhookUrl;
        window.config.N8N_USERNAME = request.n8nUsername;
        window.config.N8N_PASSWORD = request.n8nPassword;
        console.log('Configuration updated');
    } else if (request.type === 'INIT_EXTENSION') {
        console.log('Received initialization message from background script');
        init();
    }

    // Always send a response to avoid "The message port closed before a response was received" error
    sendResponse({ success: true });
    return true;
});