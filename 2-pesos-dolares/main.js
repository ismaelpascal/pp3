const arsInput = document.getElementById('ars-input');
const calcBtn = document.getElementById('calc-btn');
const dollarCardsContainer = document.getElementById('dollar-cards-container');

const API_URL = 'https://dolarapi.com/v1/dolares';

calcBtn.addEventListener('click', () => {
    const amount = parseFloat(arsInput.value) || 0;
    fetchDolarData(amount);
});

fetchDolarData(0);

async function fetchDolarData(amount) {
    const response = await fetch(API_URL);
    const data = await response.json();
    const wantedTypes = ['oficial', 'blue', 'bolsa'];
    renderCards(data.filter(d => wantedTypes.includes(d.casa)), amount);
}

function renderCards(data, amount) {
    dollarCardsContainer.innerHTML = '';
    data.forEach(dolar => {
        let bgImage = 'img/dollar_100.png';
        if (dolar.casa === 'oficial') bgImage = 'img/dollar_10.png';
        else if (dolar.casa === 'bolsa') bgImage = 'img/dollar_20.png';

        const card = document.createElement('div');
        card.className = 'dollar-card';
        card.innerHTML = `
            <div class="card-bg" style="background-image: url('${bgImage}')"></div>
            <span class="name">${dolar.nombre}</span>
            <div class="values">
                <span>venta $${dolar.venta}</span>
                <span>USD ${(amount / dolar.venta).toFixed(2)}</span>
            </div>
        `;
        dollarCardsContainer.appendChild(card);
    });
}
