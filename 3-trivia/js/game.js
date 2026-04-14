import { openCurtain, closeCurtain } from './curtain.js';

let triviaData = null;
let currentQuestions = [];
let currentIndex = 0;
let correctas = 0;
let incorrectas = 0;

const setupScreen = document.getElementById("setup-screen");
const gameScreen = document.getElementById("game-screen");
const resultScreen = document.getElementById("result-screen");

const categoriaSelect = document.getElementById("categoria");
const startBtn = document.getElementById("start-btn");

const preguntaNumero = document.getElementById("pregunta-numero");
const preguntaTexto = document.getElementById("pregunta-texto");
const opcionesContainer = document.getElementById("opciones-container");
const feedbackContainer = document.getElementById("feedback-container");
const nextBtn = document.getElementById("next-btn");

const totalPreguntasSpan = document.getElementById("total-preguntas");
const correctasCountSpan = document.getElementById("correctas-count");
const incorrectasCountSpan = document.getElementById("incorrectas-count");
const restartBtn = document.getElementById("restart-game");

export function initGame() {
    fetch("trivia.json")
        .then(response => response.json())
        .then(data => {
            triviaData = data;
        });

    startBtn.addEventListener("click", () => {
        const categoriaSeleccionada = categoriaSelect.value;
        if (categoriaSeleccionada === "") {
            alert("Por favor seleccione una categoría");
            return;
        }

        setupScreen.style.display = "none";

        openCurtain();
        iniciarPartida(categoriaSeleccionada);
    });

    nextBtn.addEventListener("click", () => {
        currentIndex++;
        if (currentIndex < 5) {
            renderizarPregunta();
        } else {
            mostrarResultados();
        }
    });

    restartBtn.addEventListener("click", () => {
        closeCurtain();

        setTimeout(() => {
            resultScreen.style.display = "none";
            gameScreen.style.display = "none";
            setupScreen.style.display = "block";
            categoriaSelect.value = "";
        }, 800);
    });
}

function iniciarPartida(nombreCategoria) {
    const categoria = triviaData.categorias.find(c => c.nombre.toLowerCase() === nombreCategoria.toLowerCase());
    const todasLasPreguntas = [...categoria.preguntas];
    currentQuestions = [];

    for (let i = 0; i < 5 && todasLasPreguntas.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * todasLasPreguntas.length);
        currentQuestions.push(todasLasPreguntas.splice(randomIndex, 1)[0]);
    }

    currentIndex = 0;
    correctas = 0;
    incorrectas = 0;

    gameScreen.style.display = "block";
    renderizarPregunta();
}

function renderizarPregunta() {
    const preguntaActual = currentQuestions[currentIndex];

    preguntaNumero.textContent = `Pregunta ${currentIndex + 1} de 5`;
    preguntaTexto.textContent = preguntaActual.pregunta;

    const opciones = [preguntaActual.correcta, ...preguntaActual.incorrectas];
    opciones.sort(() => Math.random() - 0.5);

    opcionesContainer.innerHTML = "";
    feedbackContainer.innerHTML = "";
    nextBtn.style.display = "none";

    opciones.forEach(opcion => {
        const btn = document.createElement("button");
        btn.textContent = opcion;
        btn.addEventListener("click", () => verificarRespuesta(opcion, btn));
        opcionesContainer.appendChild(btn);
    });
}

function verificarRespuesta(opcionSeleccionada, botonSeleccionado) {
    const preguntaActual = currentQuestions[currentIndex];
    const botones = opcionesContainer.querySelectorAll("button");

    botones.forEach(btn => btn.disabled = true);

    if (opcionSeleccionada === preguntaActual.correcta) {
        correctas++;
        botonSeleccionado.style.backgroundColor = "#d1fae5";
        botonSeleccionado.style.color = "#065f46";
        feedbackContainer.innerHTML = `<p style="color: #065f46;">¡Correcto!</p>`;
    } else {
        incorrectas++;
        botonSeleccionado.style.backgroundColor = "#fee2e2";
        botonSeleccionado.style.color = "#991b1b";
        feedbackContainer.innerHTML = `<p style="color: #991b1b;">Incorrecto. La respuesta era: ${preguntaActual.correcta}</p>`;
    }
    nextBtn.style.display = "block";
}

function mostrarResultados() {
    gameScreen.style.display = "none";
    resultScreen.style.display = "block";
    totalPreguntasSpan.textContent = "5";
    correctasCountSpan.textContent = correctas;
    incorrectasCountSpan.textContent = incorrectas;
}
