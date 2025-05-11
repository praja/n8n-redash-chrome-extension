// Background script for handling messages and other background tasks
console.log('Background script loaded');

chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed or updated');
});

// Function to check if a URL is a Redash query page
function isRedashQueryPage(url) {
    return url && url.includes('/queries/new');
}

// Track which tabs have had the content script injected
const injectedTabs = new Set();

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log('Tab updated:', tab.url);

    // Check if URL is available and it's a Redash query page
    if (changeInfo.url && isRedashQueryPage(changeInfo.url)) {
        console.log('Detected navigation to Redash query page');

        // Inject content script if not already injected for this tab
        if (!injectedTabs.has(tabId)) {
            console.log('Injecting content script into tab:', tabId);

            // Execute all necessary scripts in the correct order
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['marked.min.js']
            }).then(() => {
                return chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ['config.js']
                });
            }).then(() => {
                return chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ['content.js']
                });
            }).then(() => {
                console.log('Content scripts injected successfully');
                injectedTabs.add(tabId);

                // Send initialization message to content script
                chrome.tabs.sendMessage(tabId, { type: 'INIT_EXTENSION' })
                    .catch(err => console.error('Error sending init message:', err));
            }).catch(err => {
                console.error('Error injecting content script:', err);
            });

            // Inject CSS
            chrome.scripting.insertCSS({
                target: { tabId: tabId },
                files: ['styles.css']
            }).catch(err => {
                console.error('Error injecting CSS:', err);
            });
        }
    } else if (changeInfo.status === 'complete' && isRedashQueryPage(tab.url)) {
        // Handle the case where the page is loaded directly (not through navigation)
        console.log('Tab loaded completely, checking if it\'s a Redash query page');

        if (!injectedTabs.has(tabId)) {
            console.log('Injecting content script into tab:', tabId);

            // Execute all necessary scripts in the correct order
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['marked.min.js']
            }).then(() => {
                return chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ['config.js']
                });
            }).then(() => {
                return chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ['content.js']
                });
            }).then(() => {
                console.log('Content scripts injected successfully');
                injectedTabs.add(tabId);

                // Send initialization message to content script
                chrome.tabs.sendMessage(tabId, { type: 'INIT_EXTENSION' })
                    .catch(err => console.error('Error sending init message:', err));
            }).catch(err => {
                console.error('Error injecting content script:', err);
            });

            // Inject CSS
            chrome.scripting.insertCSS({
                target: { tabId: tabId },
                files: ['styles.css']
            }).catch(err => {
                console.error('Error injecting CSS:', err);
            });
        }
    }
});

// Clean up when a tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
    if (injectedTabs.has(tabId)) {
        injectedTabs.delete(tabId);
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received:', request);
    if (request.type === 'SEND_TO_N8N') {
        console.log('Processing n8n request');
        sendResponse({ success: true });
    }
    return true;
});