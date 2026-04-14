export function openCurtain() {
    const container = document.getElementById('curtain-container');
    container.classList.add('open');
}

export function closeCurtain() {
    const container = document.getElementById('curtain-container');
    container.classList.remove('open');
}

export function setupCurtain() {
    closeCurtain();
}
