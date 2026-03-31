let sequence = [];
let targetSum = 0;
let currentIndex = 0;
let delayTimeoutId = null;
let blankTimeoutId = null;

const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen');
const inputScreen = document.getElementById('input-screen');
const resultScreen = document.getElementById('result-screen');

const numCountInput = document.getElementById('num-count');
const allowNegativesCheckbox = document.getElementById('allow-negatives');
const numberDisplay = document.getElementById('number-display');
const userAnswerInput = document.getElementById('user-answer');
const resultMessage = document.getElementById('result-message');

const difficultyButtons = document.querySelectorAll('.difficulty-btn');
const submitBtn = document.getElementById('submit-answer');
const restartBtn = document.getElementById('restart-game');

difficultyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const time = e.target.getAttribute('data-time');
        startGame(time);
    });
});

submitBtn.addEventListener('click', checkAnswer);
restartBtn.addEventListener('click', showSetup);

userAnswerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

function showScreen(screenToShow) {
    [setupScreen, gameScreen, inputScreen, resultScreen].forEach(screen => {
        screen.style.display = 'none';
    });
    screenToShow.style.display = 'block';
}

function showSetup() {
    showScreen(setupScreen);
}

function generateSequence(count, min, max) {
    let seq = [];
    let sum = -1;

    while (sum < 0) {
        seq = [];
        sum = 0;
        for (let i = 0; i < count; i++) {
            let num = 0;
            while (num === 0) {
                num = Math.floor(Math.random() * (max - min + 1)) + min;
            }
            seq.push(num);
            sum += num;
        }
    }
    return { seq, sum };
}

function startGame(selectedInterval) {
    clearTimeout(delayTimeoutId);
    clearTimeout(blankTimeoutId);

    const count = parseInt(numCountInput.value) || 5;
    const intervalMs = parseFloat(selectedInterval) * 1000;
    const allowNegative = allowNegativesCheckbox.checked;

    let min, max;
    if (selectedInterval == "2") {
        min = allowNegative ? -10 : 1;
        max = 20;
    } else if (selectedInterval == "1.5") {
        min = allowNegative ? -20 : 1;
        max = 40;
    } else {
        min = allowNegative ? -40 : 1;
        max = 80;
    }

    const data = generateSequence(count, min, max);
    sequence = data.seq;
    targetSum = data.sum;
    currentIndex = 0;

    showScreen(gameScreen);
    numberDisplay.textContent = 'INICIO';
    numberDisplay.style.fontSize = '80px';
    numberDisplay.style.textAlign = 'center';

    setTimeout(() => {
        showNextNumber(intervalMs);
    }, 1200);
}

function showNextNumber(intervalMs) {
    if (currentIndex >= sequence.length) {
        numberDisplay.textContent = '';
        showScreen(inputScreen);
        userAnswerInput.value = '';
        userAnswerInput.focus();
        return;
    }

    const num = sequence[currentIndex];
    numberDisplay.textContent = num;

    const displayTime = intervalMs * 0.8;
    const blankTime = intervalMs * 0.2;

    delayTimeoutId = setTimeout(() => {
        numberDisplay.textContent = '';
        blankTimeoutId = setTimeout(() => {
            currentIndex++;
            showNextNumber(intervalMs);
        }, blankTime);
    }, displayTime);
}

function checkAnswer() {
    const answer = parseInt(userAnswerInput.value);
    if (isNaN(answer)) return;

    if (answer === targetSum) {
        resultMessage.textContent = 'Correcto';
        resultMessage.style.color = '#28a745';
    } else {
        resultMessage.textContent = `Incorrecto. El resultado es ${targetSum}.`;
        resultMessage.style.color = '#dc3545';
    }

    showScreen(resultScreen);
}
