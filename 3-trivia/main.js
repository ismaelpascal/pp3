import { initGame } from './js/game.js';
import { setupCurtain } from './js/curtain.js';

document.addEventListener('DOMContentLoaded', () => {
    setupCurtain();
    initGame();
});