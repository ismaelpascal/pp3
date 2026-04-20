const games = {
    memoriaSuma: {
        chars: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '×', '÷', '=', '%'],
        count: 20
    },
    pesosDolares: {
        chars: ['$', '€', '£', '¥', '¢', '₹', '₿', '💵', '💶', '💴', '💷'],
        count: 15
    },
    trivia: {
        chars: ['❓', '💡', '✓', '✗', '❌', '⭕', '💭', '🤔'],
        count: 15
    },
    memoriaEmojis: {
        chars: ['😊', '😂', '😍', '🤔', '😎', '🥳', '😇', '🤩', '😺', '🐱', '🎉', '⭐', '🌟', '💫'],
        count: 20
    }
};

const buttons = {
    '1': 'memoriaSuma',
    '2': 'pesosDolares',
    '3': 'trivia',
    '4': 'memoriaEmojis'
};

document.querySelectorAll('.game-btn').forEach(btn => {
    const num = btn.getAttribute('href').match(/^\/(\d)-/)?.[1];
    if (!num || !buttons[num]) return;

    const game = buttons[num];
    const config = games[game];

    btn.addEventListener('mouseenter', () => createParticles(btn, config));
});

function createParticles(container, config) {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    container.appendChild(particlesContainer);

    for (let i = 0; i < config.count; i++) {
        setTimeout(() => {
            const particle = document.createElement('span');
            particle.className = 'particle';
            particle.textContent = config.chars[Math.floor(Math.random() * config.chars.length)];
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (1 + Math.random()) + 's';
            particle.style.animationDelay = Math.random() * 0.5 + 's';
            particlesContainer.appendChild(particle);

            setTimeout(() => particle.remove(), 2000);
        }, i * 50);
    }

    setTimeout(() => particlesContainer.remove(), 3000);
}