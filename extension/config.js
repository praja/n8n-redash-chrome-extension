// Configuration for Redash AI Query Generator extension
const config = {
    N8N_WEBHOOK_URL: '',
    N8N_USERNAME: '',
    N8N_PASSWORD: ''
};

// Load configuration from Chrome storage
chrome.storage.sync.get(['n8nWebhookUrl', 'n8nUsername', 'n8nPassword'], function (items) {
    if (items.n8nWebhookUrl) {
        config.N8N_WEBHOOK_URL = items.n8nWebhookUrl;
    }
    if (items.n8nUsername) {
        config.N8N_USERNAME = items.n8nUsername;
    }
    if (items.n8nPassword) {
        config.N8N_PASSWORD = items.n8nPassword;
    }
});

// Export the configuration
window.config = config; 