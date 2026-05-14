// Ensure sessionId exists
let sessionId = localStorage.getItem('sessionId');
if (!sessionId) {
  sessionId = 'sess_' + Math.random().toString(36).substr(2, 9);
  localStorage.setItem('sessionId', sessionId);
}

document.addEventListener('DOMContentLoaded', () => {
  // Add AI Chat Widget HTML to body
  const chatHTML = `
    <div id="ai-chat-widget">
      <div class="chat-panel glass" id="chat-panel" style="display: none;">
        <div class="chat-header">
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="images/chatbot_avatar.png" alt="AI Guide" class="chat-avatar-img">
            <h3 style="margin: 0;">Rudrakrit AI Guide</h3>
          </div>
          <button class="close-btn" onclick="toggleChat()"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="chat-body" id="chat-body">
          <div class="chat-msg ai-msg">Namaste! I am your spiritual guide. How can I assist you today?</div>
        </div>
        <div class="chat-input-area">
          <input type="text" id="chat-input" placeholder="Ask about rudraksha, benefits..." onkeypress="handleChatEnter(event)">
          <button class="btn-primary" onclick="sendChatMessage()"><i class="fa-solid fa-paper-plane"></i></button>
        </div>
      </div>
      <button class="chat-fab" onclick="toggleChat()">
        <img src="images/chatbot_avatar.png" alt="Chat" class="chat-fab-img">
      </button>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', chatHTML);
});

function toggleChat() {
  const panel = document.getElementById('chat-panel');
  panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
}

function handleChatEnter(e) {
  if (e.key === 'Enter') sendChatMessage();
}

async function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const message = input.value.trim();
  if (!message) return;

  const chatBody = document.getElementById('chat-body');
  
  // Append user message
  chatBody.innerHTML += `<div class="chat-msg user-msg">${message}</div>`;
  input.value = '';
  chatBody.scrollTop = chatBody.scrollHeight;

  // Show typing indicator
  const typingId = 'typing_' + Date.now();
  chatBody.innerHTML += `<div class="chat-msg ai-msg" id="${typingId}">...</div>`;
  chatBody.scrollTop = chatBody.scrollHeight;

  try {
    const res = await api.chat(message, sessionId);
    document.getElementById(typingId).remove();
    chatBody.innerHTML += `<div class="chat-msg ai-msg">${res.response.replace(/\n/g, '<br>')}</div>`;
    chatBody.scrollTop = chatBody.scrollHeight;
  } catch (err) {
    document.getElementById(typingId).remove();
    chatBody.innerHTML += `<div class="chat-msg ai-msg" style="color: #ef4444;">Sorry, I encountered an error.</div>`;
  }
}
