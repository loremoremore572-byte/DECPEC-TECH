const input = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const messages = document.getElementById('messages');

function addMessage(text, type) {
  const div = document.createElement('div');
  div.classList.add('bubble', type);
  div.innerHTML = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

async function sendMessage() {
  const value = input.value.trim();
  if (!value) return;

  addMessage(value, 'user');
  input.value = '';

  if (value.toLowerCase().startsWith('musica')) {
    const url = value.split(' ')[1];
    if (!url) {
      addMessage("⚠ Envie o link da música após o comando.", 'bot');
      return;
    }

    try {
      const res = await fetch(`http://speedhosting.cloud:2009/download/spotify?&url=${encodeURIComponent(url)}`);
      const data = await res.json();

      if (data && data.resultado && data.resultado.status) {
        const music = data.resultado;
        addMessage(
          `🎵 <b>${music.title}</b><br>Artista: ${music.artists}<br>Lançamento: ${music.releaseDate}<br><a href="${music.music}" target="_blank">Baixar Song</a><br><img src="${music.cover}" width="150">`,
          'bot'
        );
      } else {
        addMessage("⚠ Não foi possível baixar a música.", 'bot');
      }
    } catch (e) {
      console.error(e);
      addMessage("⚠ Erro ao acessar a API do Spotify.", 'bot');
    }
  } else {
    addMessage("⚠ Comando inválido. Use: musica (link)", 'bot');
  }
}

sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keypress', e => { if(e.key==='Enter') sendMessage(); });
