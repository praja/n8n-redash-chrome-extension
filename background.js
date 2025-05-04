// Background script for handling messages and other background tasks
console.log('Background script loaded');

chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed or updated');
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log('Tab updated:', tab.url);
    if (changeInfo.status === 'complete') {
        console.log('Tab loaded completely');
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