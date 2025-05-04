document.addEventListener('DOMContentLoaded', function () {
    const n8nUrlInput = document.getElementById('n8nUrl');
    const n8nUsernameInput = document.getElementById('n8nUsername');
    const n8nPasswordInput = document.getElementById('n8nPassword');
    const saveButton = document.getElementById('saveSettings');
    const statusDiv = document.getElementById('status');

    // Load saved settings
    chrome.storage.sync.get(['n8nWebhookUrl', 'n8nUsername', 'n8nPassword'], function (items) {
        n8nUrlInput.value = items.n8nWebhookUrl || '';
        n8nUsernameInput.value = items.n8nUsername || '';
        n8nPasswordInput.value = items.n8nPassword || '';
    });

    // Save settings
    saveButton.addEventListener('click', function () {
        const n8nUrl = n8nUrlInput.value.trim();
        const n8nUsername = n8nUsernameInput.value.trim();
        const n8nPassword = n8nPasswordInput.value.trim();

        if (!n8nUrl) {
            showStatus('Please enter a valid n8n webhook URL', 'error');
            return;
        }

        chrome.storage.sync.set({
            n8nWebhookUrl: n8nUrl,
            n8nUsername: n8nUsername,
            n8nPassword: n8nPassword
        }, function () {
            showStatus('Settings saved successfully!', 'success');

            // Try to notify content script about the change
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                if (tabs[0]) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        type: 'configUpdated',
                        n8nWebhookUrl: n8nUrl,
                        n8nUsername: n8nUsername,
                        n8nPassword: n8nPassword
                    }).catch(error => {
                        // Content script might not be loaded, which is fine
                        console.log('Content script not loaded yet:', error);
                    });
                }
            });
        });
    });

    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = 'status ' + type;
        statusDiv.style.display = 'block';

        setTimeout(function () {
            statusDiv.style.display = 'none';
        }, 3000);
    }
}); 