const messagesBox = document.getElementById("messages");
const input = document.getElementById("inputMsg");
const sendBtn = document.getElementById("sendBtn");
const notifBell = document.getElementById("notifBell");
const notifBox = document.getElementById("notifBox");
const welcomeEl = document.getElementById("welcomeMsg");
const timeEl = document.getElementById("currentTime");

// Mostrar notificação
notifBell.addEventListener("click", () => {
  notifBox.classList.toggle("hidden");
});

// Atualiza a hora
function updateTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2,'0');
  const minutes = String(now.getMinutes()).padStart(2,'0');
  timeEl.textContent = `Hora atual: ${hours}:${minutes}`;
}

// Saudação dinâmica
function updateWelcome() {
  const hour = new Date().getHours();
  let greeting = 'Bem-vindo!';
  if(hour >= 5 && hour < 12) greeting = 'Bom dia!';
  else if(hour >= 12 && hour < 18) greeting = 'Boa tarde!';
  else greeting = 'Boa noite!';
  welcomeEl.textContent = `${greeting} Digite sua mensagem abaixo.`;
}

updateTime();
updateWelcome();
setInterval(updateTime, 1000); // atualiza a cada segundo

// Função para adicionar mensagens (com emojis)
function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = `bubble ${sender}`;

  // Substituir códigos de emoji por emoji real
  div.innerHTML = text
    .replace(/:smile:/g, "😄")
    .replace(/:sad:/g, "😢")
    .replace(/:heart:/g, "❤️")
    .replace(/:music:/g, "🎵");

  messagesBox.appendChild(div);
  messagesBox.scrollTop = messagesBox.scrollHeight;
}

// Função para enviar mensagens
async function sendMessage() {
  const msg = input.value.trim();
  if (!msg) return;

  addMessage(msg, "user");
  input.value = "";

  // Comando de suporte
  if (msg.startsWith("/Suporte")) {
    addMessage("📞 Suporte: null", "bot");
    return;
  }

  // Comando de Spotify
  if (msg.startsWith("/spotify")) {
    const url = msg.split(" ")[1];
    if (!url) {
      addMessage("⚠ Por favor, envie a URL da música.", "bot");
      return;
    }

    try {
      const res = await fetch(`http://speedhosting.cloud:2009/download/spotify?&url=${encodeURIComponent(url)}`);
      const data = await res.json();

      if (data && data.resultado && data.resultado.status) {
        const music = data.resultado;
        addMessage(
          `🎵 <b>${music.title}</b>\nArtista: ${music.artists}\nLançamento: ${music.releaseDate}\n<a href="${music.music}" target="_blank" style="color:#0a84ff;">Baixar música</a>\n<img src="${music.cover}" width="150">`,
          "bot"
        );
      } else {
        addMessage("⚠ Não foi possível baixar a música.", "bot");
      }

    } catch (e) {
      console.error(e);
      addMessage("⚠ Erro ao acessar a API do Spotify.", "bot");
    }
    return;
  }

  // Enviar mensagem para API Gemini
  try {
    const res = await fetch(`http://speedhosting.cloud:2009/ias/gemini?prompt=${encodeURIComponent(msg)}`);
    const data = await res.json();

    if (data && data.resultado && data.resultado.resposta) {
      addMessage(data.resultado.resposta, "bot");
    } else {
      addMessage("⚠ Resposta inesperada da IA.", "bot");
    }

  } catch (e) {
    console.error(e);
    addMessage("⚠ Erro ao conectar com a IA.", "bot");
  }
}

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

// Mensagem inicial
addMessage("👋 Olá, eu sou o DESPEK. Como posso ajudar?");
