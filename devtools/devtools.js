// LLM Dev Inspector DevTools Script

// Function to create the DevTools panel
function createPanel() {
  chrome.devtools.panels.create(
    "LLM Dev Inspector", // Title of the panel
    null, // Icon path (optional)
    "devtools/devtools.html", // HTML page for the panel
    function(panel) {
      // Panel created callback
      console.log("LLM Dev Inspector panel created.");
      
      // Connect to the background service worker
      const backgroundPageConnection = chrome.runtime.connect({
        name: "llm-dev-inspector-port"
      });

      backgroundPageConnection.onMessage.addListener(message => {
        // Handle messages from the background script (e.g., LLM Router responses)
        console.log("Message from background:", message);
        // TODO: Update UI with LLM response (Phase 4/5)
      });

      // Example function to send a request to the LLM Router
      window.sendLLMRequest = (data) => {
        backgroundPageConnection.postMessage({
          type: "LLM_ROUTER_REQUEST",
          payload: data
        });
      };
    }
  );
}

// Call the function to create the panel
createPanel();
