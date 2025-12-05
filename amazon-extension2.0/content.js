// content.js
(function () {

  console.log("Content script loaded");

  const THEME_KEY = 'appTheme';

  if (document.getElementById('amazon-extension-app')) return;

  
  const modal = document.createElement('div');
  modal.id = 'amazon-extension-app';
  modal.classList.add('extension-modal-wrapper');

  modal.innerHTML = `
      <div class="header">
        <div class="header-title">Shopping Helper</div>
        <div class="header-subtitle">Powered by OpenAI</div>
        <div class="modal-buttons">
          <button id="minimizeBtn">–</button>
          <button id="closeBtn">×</button>
        </div>
      </div>

      <div class="main-content">
        <div class="input-group">
          <label for="userQuery">Ask something:</label>
          <input id="userQuery" type="text" class="input-field" placeholder="Type a question...">
        </div>

        <button id="askBtn" class="action-button">
          <svg class="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Ask AI
        </button>

        <div class="output-box">
          <div class="output-title">Response:</div>
          <div id="responseText" class="output-text"></div>
        </div>
      </div>

      <footer>
        <a href="#" class="footer-link">Learn more</a>
      </footer>
  `;

  document.body.appendChild(modal);

  function applyModalTheme(theme) {
    if (theme === 'light') {
      modal.classList.add('light-mode');
    } else {
      modal.classList.remove('light-mode');
    }
  }

  // Load saved theme
  const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
  applyModalTheme(savedTheme);

  window.addEventListener('storage', (event) => {
    if (event.key === THEME_KEY) {
      applyModalTheme(event.newValue);
    }
  });

  const header = modal.querySelector('.header');
  let isDragging = false, offsetX = 0, offsetY = 0;

  header.addEventListener('mousedown', (e) => {
    isDragging = true;
    header.style.cursor = 'grabbing';
    offsetX = e.clientX - modal.offsetLeft;
    offsetY = e.clientY - modal.offsetTop;
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      modal.style.left = `${e.clientX - offsetX}px`;
      modal.style.top = `${e.clientY - offsetY}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    header.style.cursor = 'grab';
  });

  document.getElementById('closeBtn').addEventListener('click', () => {
    modal.remove();
  });

  document.getElementById('minimizeBtn').addEventListener('click', () => {
    const content = modal.querySelector('.main-content');
    content.style.display = content.style.display === 'none' ? 'block' : 'none';
  });

  document.getElementById('askBtn').addEventListener('click', () => {
    const userQuery = document.getElementById('userQuery').value;
    const responseBox = document.getElementById('responseText');

    console.log("Sending query to background:", userQuery);

    chrome.runtime.sendMessage(
      {
        action: 'runOpenAIQuery',
        query: userQuery
      },
      (response) => {
        console.log("Received response:", response);

        if (!response || !response.success) {
          responseBox.textContent = "Error retrieving response.";
          return;
        }

        responseBox.textContent = response.result || "No response";
      }
    );
  });

})();
