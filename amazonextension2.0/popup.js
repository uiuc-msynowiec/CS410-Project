document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('action-button');
    const output = document.getElementById('output-area');
    const inputField = document.getElementById('input-field');

    button.addEventListener('click', () => {
        const query = inputField.value.trim();
        // Update status message
        output.textContent = 'Action triggered with query: "' + (query || 'No query') + '".';

        // In a real extension, you would replace this timeout with
        // logic like: chrome.tabs.query() or chrome.runtime.sendMessage().
        setTimeout(() => {
            output.textContent = 'Ready for next action.';
        }, 2000);
    });
});