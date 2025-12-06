// content.js
(function () {
  console.log("Content script loaded");

  const THEME_KEY = 'appTheme';

  // Prevent duplicate modal
  if (document.getElementById('amazon-extension-app')) return;

  // Create modal container
  // Create modal container
  const modal = document.createElement('div');
  modal.id = 'amazon-extension-app';
  modal.classList.add('extension-modal-wrapper');

  modal.style.width = '350px';
  modal.style.minHeight = '200px'; 
  modal.style.backgroundColor = '#111827'; 
  modal.style.color = '#f3f4f6';
  modal.style.borderRadius = '0.75rem';
  modal.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.5)';

  modal.innerHTML = `
    <div class="header" id="modalHeader">
      <div style="display:flex; justify-content:space-between; align-items:center; gap:0.5rem;">
        <div>
          <div class="header-title">Shopping Helper</div>
          <div class="header-subtitle">Powered by OpenAI</div>
        </div>
        <div class="modal-buttons">
          <button id="minimizeBtn" title="Minimize">–</button>
          <button id="closeBtn" title="Close">×</button>
        </div>
      </div>
    </div>

    <div class="main-content" id="mainContent">
      <div class="input-group">
        <label for="userQuery">Ask something:</label>
        <input id="userQuery" type="text" class="input-field" placeholder="Type a question...">
      </div>

      <button id="askBtn" class="action-button">
        <svg class="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        Ask AI
      </button>

      <div class="output-box">
        <div class="output-title">Response:</div>
        <div id="responseText" class="output-text">Ready for action.</div>
      </div>
    </div>

    <!-- Footer with Settings link -->
    <footer id="modalFooter">
      <a id="settingsLink" class="footer-link" href="#">Settings</a>
    </footer>

    <!-- Hidden settings panel inside modal -->
    <div id="settingsPanel" class="settings-panel" style="display:none;">
      <h2 class="settings-title">Settings</h2>

      <label class="settings-label" for="themeSelector">Theme</label>
      <select id="themeSelector" class="settings-select">
        <option value="dark">Dark Mode</option>
        <option value="light">Light Mode</option>
      </select>

      <button id="closeSettings" class="settings-back-button">Back</button>
    </div>
  `;

  // Insert into page
  document.body.appendChild(modal);
  // Ensure main content is visible by default
  const mainContent = modal.querySelector("#mainContent");
  mainContent.style.display = "block";

  // Ensure settings panel is hidden
  const settingsPanel = modal.querySelector("#settingsPanel");
  settingsPanel.style.display = "none";

  // Ensure modal has explicit left/top so dragging works even with right styling
  if (!modal.style.left) {
    modal.style.left = (window.innerWidth - 380) + 'px'; // slightly left from right
  }
  if (!modal.style.top) {
    modal.style.top = '100px';
  }
  modal.style.position = 'fixed';
  modal.style.resize = 'both';
  modal.style.overflow = 'auto';

  // ---------- THEME HANDLING ----------
  function applyModalTheme(theme) {
    if (theme === 'light') {
      modal.classList.add('light-mode');
    } else {
      modal.classList.remove('light-mode');
    }
  }
  const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
  applyModalTheme(savedTheme);

  window.addEventListener('storage', (event) => {
    if (event.key === THEME_KEY) applyModalTheme(event.newValue);
  });

  const header = modal.querySelector('#modalHeader') || modal.querySelector('.header');
  const settingsLink = modal.querySelector('#settingsLink');
  const closeSettings = modal.querySelector('#closeSettings');
  const themeSelector = modal.querySelector('#themeSelector');
  const closeBtn = modal.querySelector('#closeBtn');
  const minimizeBtn = modal.querySelector('#minimizeBtn');
  const askBtn = modal.querySelector('#askBtn');
  const userQueryInput = modal.querySelector('#userQuery');
  const responseBox = modal.querySelector('#responseText');

  // Initialize theme select value if present
  if (themeSelector) themeSelector.value = savedTheme;

  settingsLink.addEventListener("click", () => {
    mainContent.style.display = "none";
    modal.querySelector("#modalFooter").style.display = "none";
    settingsPanel.style.display = "block";
  });
  
  closeSettings.addEventListener("click", () => {
    settingsPanel.style.display = "none";
    mainContent.style.display = "block";
    modal.querySelector("#modalFooter").style.display = "flex";
  });
  

  if (themeSelector) {
    themeSelector.addEventListener('change', (e) => {
      const newTheme = e.target.value;
      localStorage.setItem(THEME_KEY, newTheme);
      applyModalTheme(newTheme);
    });
  }

  // ---------- MINIMIZE / CLOSE ----------
  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.remove());
  }
  if (minimizeBtn) {
    minimizeBtn.addEventListener("click", () => {
      const isHidden = mainContent.style.display === "none" &&
                       settingsPanel.style.display === "none";
    
      if (isHidden) {
        // Restore modal
        mainContent.style.display = "block";
        modal.querySelector("#modalFooter").style.display = "flex";
      } else {
        // Minimize modal
        mainContent.style.display = "none";
        settingsPanel.style.display = "none";
        modal.querySelector("#modalFooter").style.display = "none";
      }
    });
    
  }

  // ---------- DRAGGING ----------
  let isDragging = false;
  let offsetX = 0, offsetY = 0;

  header.style.cursor = 'grab';
  header.addEventListener('mousedown', (e) => {
    isDragging = true;
    header.style.cursor = 'grabbing';
    // ensure modal has left/top numeric values
    const rect = modal.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    // temporarily disable transitions
    modal.style.transition = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    modal.style.left = `${e.clientX - offsetX}px`;
    modal.style.top = `${e.clientY - offsetY}px`;
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      header.style.cursor = 'grab';
      modal.style.transition = ''; // restore transitions
    }
  });

  // ---------- RESIZING (CSS controls resize) ----------
  // CSS 'resize: both' and 'overflow: auto' already enabled above

  // ---------- ASK BUTTON -> background.js ----------
  if (askBtn) {
    askBtn.addEventListener('click', () => {
      const userQuery = (userQueryInput && userQueryInput.value) ? userQueryInput.value.trim() : '';
      if (!userQuery) {
        responseBox.textContent = 'Please enter a query.';
        return;
      }

      responseBox.textContent = 'Thinking...';
      chrome.runtime.sendMessage(
        { action: 'runOpenAIQuery', query: userQuery },
        (response) => {
          console.log('Background response:', response);
          if (!response || !response.success) {
            responseBox.textContent = `Error: ${response?.error || 'No response'}`;
            return;
          }
          responseBox.textContent = response.result || 'No response';
        }
      );
    });
  }

  // Ensure input text color remains black on dark theme
  if (userQueryInput) {
    userQueryInput.style.color = '#000';
    userQueryInput.style.backgroundColor = '#fff';
  }

})();
