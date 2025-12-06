chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'runOpenAIQuery') {
    console.log('Background received query:', message.query);

    // Connect to WebSocket bridge
    const ws = new WebSocket("ws://localhost:32001");

    ws.onopen = () => {
      ws.send(message.query);
    };

    ws.onmessage = (event) => {
      sendResponse({ success: true, result: event.data });
      ws.close();
    };
    
    return true;
  }
});