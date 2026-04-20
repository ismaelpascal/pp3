let emojisJson = [];
let tarjetas = [];
let primeraTarjeta = null;
let segundaTarjeta = null;
let bloqueado = false;

function barajear(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function iniciarJuego() {
  const response = await fetch('emojis.json');
  emojisJson = await response.json();
  
  tarjetas = [];
  
  for (let i = 0; i < emojisJson.length; i++) {
    tarjetas.push({ ...emojisJson[i], uniqueId: i * 2 });
    tarjetas.push({ ...emojisJson[i], uniqueId: i * 2 + 1 });
  }
  
  barajear(tarjetas);
  
  const juego = document.getElementById('juego');
  if (juego) {
    juego.innerHTML = '';
    tarjetas.forEach((tarjeta, index) => {
      const div = document.createElement('div');
      div.className = 'tarjeta';
      div.dataset.index = index;
      div.dataset.id = tarjeta.id;
      div.innerHTML = '<span class="emoji">?</span>';
      div.addEventListener('click', () => voltearTarjeta(div, tarjeta));
      juego.appendChild(div);
    });
  }
}

function voltearTarjeta(elemento, tarjeta) {
  if (bloqueado) return;
  if (elemento.classList.contains('volteada')) return;
  if (primeraTarjeta && primeraTarjeta.elemento === elemento) return;

  elemento.classList.add('volteada');
  elemento.querySelector('.emoji').textContent = tarjeta.emoji;

  if (!primeraTarjeta) {
    primeraTarjeta = { elemento, tarjeta };
  } else {
    segundaTarjeta = { elemento, tarjeta };
    verificarPareja();
  }
}

function verificarPareja() {
  bloqueado = true;
  
  if (primeraTarjeta.tarjeta.id === segundaTarjeta.tarjeta.id) {
    primeraTarjeta = null;
    segundaTarjeta = null;
    bloqueado = false;
  } else {
    setTimeout(() => {
      primeraTarjeta.elemento.classList.remove('volteada');
      primeraTarjeta.elemento.querySelector('.emoji').textContent = '?';
      segundaTarjeta.elemento.classList.remove('volteada');
      segundaTarjeta.elemento.querySelector('.emoji').textContent = '?';
      primeraTarjeta = null;
      segundaTarjeta = null;
      bloqueado = false;
    }, 1000);
  }
}

document.addEventListener('DOMContentLoaded', iniciarJuego);