const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
});

const equations = [];

function generateRandomEquation() {
    const ops = ['+', '-', '*', '/'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    const a = Math.floor(Math.random() * 50) + 1;
    const b = Math.floor(Math.random() * 50) + 1;
    let res;
    switch (op) {
        case '+': res = a + b; break;
        case '-': res = a - b; break;
        case '*': res = a * b; break;
        case '/': res = (a % b === 0) ? (a / b) : (a / b).toFixed(2); break;
    }
    return `${a} ${op} ${b} = ${res}`;
}

function createEquationObj(resetY = false) {
    return {
        text: generateRandomEquation(),
        x: Math.random() * width * 1.2 - width * 0.1,
        y: resetY ? -(Math.random() * 100 + 50) : Math.random() * height,
        speed: Math.random() * 1.5 + 0.5,
        fontSize: Math.floor(Math.random() * 16) + 14,
        alpha: Math.random() * 0.3 + 0.1
    };
}

// Initial fill
for (let i = 0; i < 50; i++) {
    equations.push(createEquationObj(false));
}

function hexToRgb(hex) {
    const defaultColor = '0, 255, 128';
    if (!hex) return defaultColor;
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : defaultColor;
}

function drawEquations() {
    ctx.clearRect(0, 0, width, height);

    const currentPrimary = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
    const rgbStr = hexToRgb(currentPrimary);

    equations.forEach((eq, index) => {
        ctx.fillStyle = `rgba(${rgbStr}, ${eq.alpha})`;
        ctx.font = `${eq.fontSize}px monospace`;
        ctx.fillText(eq.text, eq.x, eq.y);

        eq.y += eq.speed;

        if (eq.y > height + 50) {
            equations[index] = createEquationObj(true);
        }
    });

    requestAnimationFrame(drawEquations);
}

drawEquations();
