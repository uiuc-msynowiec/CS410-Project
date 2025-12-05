chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'runOpenAIQuery') {
    console.log('Background received query:', message.query);

    fetch('http://localhost:3000/api/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: message.query }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Server response:', data);
        sendResponse({ success: true, result: data.result });
      })
      .catch((err) => {
        console.error('Server error:', err);
        sendResponse({ success: false, error: err.message });
      });

    return true;
  }
});