let RESPONSES = [];

export async function loadChatbotData() {
  const res = await fetch('data/chatbot-responses.json');
  RESPONSES = await res.json();
}

function findAnswer(text) {
  const lower = text.toLowerCase();
  const match = RESPONSES.find(r => r.keywords.some(k => lower.includes(k)));
  return match || { answer: "I don't have an answer for that yet — try asking about market hours, seasonal produce, or how to find a market near you." };
}

function appendMessage(body, text, sender) {
  const div = document.createElement('div');
  div.className = `chat-msg ${sender}`;
  div.textContent = text;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

export function initChatbot() {
  const launcher = document.getElementById('chatbotLauncher');
  const widget = document.getElementById('chatbotWidget');
  const closeBtn = document.getElementById('chatbotClose');
  const form = document.getElementById('chatbotForm');
  const input = document.getElementById('chatbotInput');
  const body = document.getElementById('chatbotBody');
  const headerBtn = document.getElementById('chatbotLauncherBtn');
  const heroAsk = document.getElementById('heroAskBot');

  function openChat() {
    widget.classList.add('open');
    if (!body.dataset.greeted) {
      appendMessage(body, "Hi! I'm FreshBot. Ask me about market hours, what's in season, or how to find a market near you.", 'bot');
      const quick = document.createElement('div');
      quick.className = 'chat-quick';
      quick.innerHTML = `
        <button data-q="Find a market near me">Find a market near me</button>
        <button data-q="What's in season?">What's in season?</button>
        <button data-q="Market hours">Market hours</button>`;
      body.appendChild(quick);
      quick.querySelectorAll('button').forEach(b => b.addEventListener('click', () => handleUserMessage(b.dataset.q)));
      body.dataset.greeted = 'true';
    }
  }

  function handleUserMessage(text) {
    if (!text.trim()) return;
    appendMessage(body, text, 'user');
    const result = findAnswer(text);
    setTimeout(() => appendMessage(body, result.answer, 'bot'), 300);
    input.value = '';
  }

  launcher.addEventListener('click', openChat);
  headerBtn.addEventListener('click', openChat);
  if (heroAsk) heroAsk.addEventListener('click', openChat);
  closeBtn.addEventListener('click', () => widget.classList.remove('open'));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleUserMessage(input.value);
  });
}
