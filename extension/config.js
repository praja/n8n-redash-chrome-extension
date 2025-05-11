// Configuration for Redash AI Query Generator extension
// Check if config is already defined to avoid redeclaration
if (typeof window.config === 'undefined') {
    console.log('Initializing config object');
    window.config = {
        N8N_WEBHOOK_URL: '',
        N8N_USERNAME: '',
        N8N_PASSWORD: ''
    };

    // Load configuration from Chrome storage
    chrome.storage.sync.get(['n8nWebhookUrl', 'n8nUsername', 'n8nPassword'], function (items) {
        if (items.n8nWebhookUrl) {
            window.config.N8N_WEBHOOK_URL = items.n8nWebhookUrl;
        }
        if (items.n8nUsername) {
            window.config.N8N_USERNAME = items.n8nUsername;
        }
        if (items.n8nPassword) {
            window.config.N8N_PASSWORD = items.n8nPassword;
        }
        console.log('Config loaded from storage');
    });
} else {
    console.log('Config already defined, skipping initialization');
}