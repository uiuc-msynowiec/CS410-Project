(function () {
    if (document.getElementById('amazon-extension-app')) return;
  
    const modal = document.createElement('div');
    modal.id = 'amazon-extension-app';
    modal.classList.add('extension-modal-wrapper');
    modal.innerHTML = `
      <div class="app-container">
          <header class="header drag-handle">
              <h1 class="header-title">Extension Name</h1>
              <p class="header-subtitle">Quick actions for the current tab.</p>
              <div class="modal-buttons">
                  <button id="minimize-modal" title="Minimize">—</button>
                  <button id="close-modal" title="Close">×</button>
              </div>
          </header>
  
          <main class="main-content">
              <div class="input-group">
                  <label for="input-field">Enter Query</label>
                  <input type="text" id="input-field" placeholder="Type your action or query here..." class="input-field">
              </div>
  
              <div>
                  <button id="action-button" class="action-button">
                      Run Extension Logic
                  </button>
              </div>
  
              <div class="output-box">
                  <h3 class="output-title">Status:</h3>
                  <p id="output-area" class="output-text">Ready for action.</p>
              </div>
          </main>
  
          <footer>
              <a href="#" class="footer-link">Settings</a>
          </footer>
      </div>
    `;
  
    document.body.appendChild(modal);
    const style = document.createElement('style');
    style.textContent = `
      #amazon-extension-app .input-field {
        color: black !important;
        background-color: white !important;
        border: 1px solid #ccc;
      }
    
      #amazon-extension-app label {
        color: white !important;
      }
    
      #amazon-extension-app .output-text {
        color: black !important;
      }
    `;
    document.head.appendChild(style);
  
    const button = modal.querySelector('#action-button');
    const inputField = modal.querySelector('#input-field');
    const output = modal.querySelector('#output-area');
    const closeBtn = modal.querySelector('#close-modal');
    const minimizeBtn = modal.querySelector('#minimize-modal');
    const content = modal.querySelector('main');
    const footer = modal.querySelector('footer');
    const dragHandle = modal.querySelector('.drag-handle');
    
    //adding moving, resizing
    closeBtn.addEventListener('click', () => modal.remove());
  
    let minimized = false;
    minimizeBtn.addEventListener('click', () => {
      minimized = !minimized;
      content.style.display = minimized ? 'none' : 'flex';
      footer.style.display = minimized ? 'none' : 'flex';
      modal.style.height = minimized ? 'auto' : '';
      minimizeBtn.textContent = minimized ? '+' : '—';
    });
  
    let offsetX, offsetY, isDragging = false;
    dragHandle.addEventListener('mousedown', (e) => {
      isDragging = true;
      offsetX = e.clientX - modal.offsetLeft;
      offsetY = e.clientY - modal.offsetTop;
      modal.style.transition = 'none';
      dragHandle.style.cursor = 'grabbing';
    });
  
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      modal.style.left = e.clientX - offsetX + 'px';
      modal.style.top = e.clientY - offsetY + 'px';
    });
  
    document.addEventListener('mouseup', () => {
      isDragging = false;
      dragHandle.style.cursor = 'grab';
    });
  
    modal.style.resize = 'both';
    modal.style.overflow = 'auto';
  
    //query sending to api
    button.addEventListener('click', async () => {
      const query = inputField.value.trim();
      if (!query) {
        output.textContent = 'Please enter a query.';
        return;
      }
  
      output.textContent = 'Thinking...';
      console.log('Sending query to background:', query);
  
      //sending messagr to backgroundjs
      chrome.runtime.sendMessage(
        { action: 'runOpenAIQuery', query },
        (response) => {
          if (!response) {
            output.textContent = 'No response from background.';
            console.error('No response from background');
            return;
          }
  
          if (response.success) {
            output.textContent = response.result;
            console.log('Received response:', response);
          } else {
            output.textContent = 'Error: ' + response.error;
            console.error('Error from background:', response.error);
          }
        }
      );
    });
  })();
  