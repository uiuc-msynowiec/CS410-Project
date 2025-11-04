(function () {
    if (document.getElementById('amazon-extension-app')) return;
  
    //modal container based on charlene's html
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
                      <svg class="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2m-9 0V3h4v2m-4 0h4"></path>
                      </svg>
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
  
    //close button
    modal.querySelector('#close-modal').addEventListener('click', () => modal.remove());
  
    //minimize button
    const minimizeBtn = modal.querySelector('#minimize-modal');
    const content = modal.querySelector('main');
    const footer = modal.querySelector('footer');
    let minimized = false;
  
    minimizeBtn.addEventListener('click', () => {
      minimized = !minimized;
      content.style.display = minimized ? 'none' : 'flex';
      footer.style.display = minimized ? 'none' : 'flex';
      modal.style.height = minimized ? 'auto' : '';
      minimizeBtn.textContent = minimized ? '+' : '—';
    });
  
    //add moveability
    const dragHandle = modal.querySelector('.drag-handle');
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
  
    //add resizing
    modal.style.resize = 'both';
    modal.style.overflow = 'auto';
  })();  