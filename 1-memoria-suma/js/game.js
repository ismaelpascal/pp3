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
const startGameBtn = document.getElementById('start-game-btn');
const numberDisplay = document.getElementById('number-display');
const userAnswerInput = document.getElementById('user-answer');
const resultMessage = document.getElementById('result-message');

const speedButtons = document.querySelectorAll('.speed-selection .option-btn');
const rangeButtons = document.querySelectorAll('.range-selection .option-btn');
const submitBtn = document.getElementById('submit-answer');
const restartBtn = document.getElementById('restart-game');

function updateDifficultyColor() {
    const activeSpeedBtn = document.querySelector('.speed-selection .option-btn.active');
    const activeRangeBtn = document.querySelector('.range-selection .option-btn.active');

    let speedPoints = 1;
    let rangePoints = 1;

    if (activeSpeedBtn) {
        const time = activeSpeedBtn.getAttribute('data-time');
        if (time == "2") speedPoints = 1;
        else if (time == "1.5") speedPoints = 2;
        else if (time == "1") speedPoints = 3;
    }

    if (activeRangeBtn) {
        const rangeType = activeRangeBtn.getAttribute('data-range');
        if (rangeType === 'easy') rangePoints = 1;
        else if (rangeType === 'medium') rangePoints = 2;
        else if (rangeType === 'hard') rangePoints = 3;
    }

    const totalPoints = speedPoints + rangePoints; // 2 to 6

    let primaryColor, glowColor;

    if (totalPoints === 2) {
        primaryColor = '#00ff80';
        glowColor = 'rgba(0, 255, 128, 0.4)';
    } else if (totalPoints === 3) {
        primaryColor = '#b3ff00';
        glowColor = 'rgba(179, 255, 0, 0.4)';
    } else if (totalPoints === 4) {
        primaryColor = '#ffe600';
        glowColor = 'rgba(255, 230, 0, 0.4)';
    } else if (totalPoints === 5) {
        primaryColor = '#ff8000';
        glowColor = 'rgba(255, 128, 0, 0.4)';
    } else if (totalPoints === 6) {
        primaryColor = '#ff0040';
        glowColor = 'rgba(255, 0, 64, 0.4)';
    } else {
        primaryColor = '#00ff80';
        glowColor = 'rgba(0, 255, 128, 0.4)';
    }

    document.documentElement.style.setProperty('--primary', primaryColor);
    document.documentElement.style.setProperty('--primary-glow', glowColor);
}

function setupButtonGroup(buttons) {
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateDifficultyColor();
        });
    });
}

setupButtonGroup(speedButtons);
setupButtonGroup(rangeButtons);
updateDifficultyColor();

startGameBtn.addEventListener('click', () => {
    const activeSpeedBtn = document.querySelector('.speed-selection .option-btn.active');
    const activeRangeBtn = document.querySelector('.range-selection .option-btn.active');

    const time = activeSpeedBtn ? activeSpeedBtn.getAttribute('data-time') : 2;
    const rangeType = activeRangeBtn ? activeRangeBtn.getAttribute('data-range') : 'easy';

    startGame(time, rangeType);
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

    // We avoid sums < 0 to keep it simple, or we can allow them if user wants.
    // The previous code had sum < 0 check. I'll keep it for now.
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

function startGame(selectedInterval, rangeType) {
    clearTimeout(delayTimeoutId);
    clearTimeout(blankTimeoutId);

    const count = parseInt(numCountInput.value) || 5;
    const intervalMs = parseFloat(selectedInterval) * 1000;
    const allowNegative = allowNegativesCheckbox.checked;

    let min, max;
    if (rangeType === 'easy') {
        min = allowNegative ? -10 : 1;
        max = 20;
    } else if (rangeType === 'medium') {
        min = allowNegative ? -20 : 1;
        max = 40;
    } else if (rangeType === 'hard') {
        min = allowNegative ? -40 : 1;
        max = 80;
    } else {
        min = 1;
        max = 10;
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
