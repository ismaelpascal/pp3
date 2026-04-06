const arsInput = document.getElementById('ars-input');
const calcBtn = document.getElementById('calc-btn');
const resultsTable = document.getElementById('results-table');
const tableBody = document.getElementById('table-body');

const API_URL = 'https://dolarapi.com/v1/dolares';

calcBtn.addEventListener('click', () => {
    const amount = parseFloat(arsInput.value);
    fetchDolarData(amount);
});

fetchDolarData();

async function fetchDolarData(amount) {
    const response = await fetch(API_URL);
    const data = await response.json();

    const wantedTypes = ['oficial', 'blue', 'bolsa'];
    renderTable(data.filter(d => wantedTypes.includes(d.casa)), amount);
}


function renderTable(data, amount) {
    tableBody.innerHTML = '';

    data.forEach(dolar => {
        const tr = document.createElement('tr');

        let tipoNombre = dolar.nombre;
        let colorIdentificador = '';

        if (dolar.casa === 'oficial') {
            colorIdentificador = '#3498db';
        } else if (dolar.casa === 'blue') {
            colorIdentificador = '#2ecc71';
        } else if (dolar.casa === 'bolsa') {
            tipoNombre = 'MEP';
            colorIdentificador = '#9b59b6';
        }

        const compra = dolar.compra;
        const venta = dolar.venta;

        const usdCompra = (amount / compra).toFixed(2);
        const usdVenta = (amount / venta).toFixed(2);

        tr.innerHTML = `
            <td style="color: ${colorIdentificador}; font-weight: bold;">${tipoNombre}</td>
            <td>$${compra}</td>
            <td>$${venta}</td>
            <td>${usdCompra}</td>
            <td>${usdVenta}</td>
        `;

        tableBody.appendChild(tr);
    });


}

