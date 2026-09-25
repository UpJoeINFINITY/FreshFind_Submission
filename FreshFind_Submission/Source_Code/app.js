document.addEventListener("DOMContentLoaded", () => {
  const clock = document.getElementById("clock");
  const tick = () => {
    if (clock)
      clock.textContent = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date());
  };
  tick();
  setInterval(tick, 30000);
  const menu = document.querySelector(".mobile-menu"),
    nav = document.querySelector(".main-nav");
  if (menu && nav) menu.onclick = () => nav.classList.toggle("mobile-open");
  const login = document.querySelector(".header-login");
  if (login)
    login.onclick = () =>
      alert("Login / Sign Up is a demo feature for this project.");
  const fav = document.querySelector(".header-favourite");
  if (fav)
    fav.onclick = () => alert("Your saved markets list is a demo feature.");
  const chat = document.getElementById("chatbot"),
    launcher = document.getElementById("chatLauncher"),
    close = document.getElementById("chatClose"),
    min = document.getElementById("chatMin"),
    body = document.getElementById("chatBody"),
    form = document.getElementById("chatForm"),
    input = document.getElementById("chatInput");
  if (chat && launcher) {
    launcher.onclick = () => chat.classList.toggle("hidden");
    close.onclick = () => chat.classList.add("hidden");
    min.onclick = () => chat.classList.toggle("minimized");
    document
      .querySelectorAll(".quick-replies button")
      .forEach((b) => (b.onclick = () => send(b.dataset.question)));
    if (form)
      form.onsubmit = (e) => {
        e.preventDefault();
        send(input.value);
        input.value = "";
      };
  }
  async function send(q) {
    if (!q || !q.trim()) return;
    addMsg(q, "user");
    let answer =
      "I can help you explore markets, produce, seasons, and market locations. Try asking about tomatoes, plantain, seasonal produce, or markets.";
    try {
      const data = await fetch("chatbot.json").then((r) => r.json());
      const hit = data.responses.find((x) =>
        x.keywords.some((k) => q.toLowerCase().includes(k)),
      );
      if (hit) answer = hit.answer;
    } catch (e) {}
    setTimeout(() => addMsg(answer, "bot"), 280);
  }
  function addMsg(t, type) {
    if (!body) return;
    const d = document.createElement("div");
    d.className = type === "user" ? "user-message" : "bot-message";
    d.textContent = t;
    body.appendChild(d);
    body.scrollTop = body.scrollHeight;
  }
});
