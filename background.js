// LLM Dev Inspector Background Service Worker

import { runAllVisibilityChecks } from './ecosystem_visibility.js';

// This script handles communication between the DevTools panel and the LLM Router Service.

// Map to hold port connections from DevTools panels
const ports = {};

chrome.runtime.onConnect.addListener(port => {
  if (port.name !== "llm-dev-inspector-port") return;

  // Store the port connection
  ports[port.sender.tab.id] = port;

  port.onMessage.addListener(msg => {
    // Message from DevTools panel
    if (msg.type === "LLM_ROUTER_REQUEST") {
      console.log("Received LLM Router Request:", msg.payload);
      // TODO: Forward this request to the actual LLM Router Service (Phase 4)
      
      // STUB: Simulate a response for now
      setTimeout(() => {
        port.postMessage({
          type: "LLM_ROUTER_RESPONSE",
          payload: {
            status: "STUB_SUCCESS",
            message: "Request received and will be processed by the LLM Router.",
            original_request: msg.payload
          }
        });
      }, 500);
    }
  });

  port.onDisconnect.addListener(() => {
    delete ports[port.sender.tab.id];
  });
});

// Function to inject the content script (if needed for runtime inspection)
function injectContentScript(tabId) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ['content_script.js']
  });
}

// Listen for messages from the content script (if implemented)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (sender.tab && ports[sender.tab.id]) {
    // Forward message from content script to DevTools panel
    ports[sender.tab.id].postMessage(message);
  }
});

// Run visibility checks on startup
runAllVisibilityChecks().then(results => {
    console.log("Ecosystem Visibility Check Results:", results);
});

console.log("LLM Dev Inspector Background Service Worker started.");
