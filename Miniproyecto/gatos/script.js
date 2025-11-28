// Variables globales
let catFacts = [];
let currentFactIndex = 0;
const API_URL = 'https://catfact.ninja';

// Elementos del DOM
const factBox = document.getElementById('factBox');
const nextBtn = document.getElementById('nextBtn');
const resetBtn = document.getElementById('resetBtn');
const loading = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const factCounter = document.getElementById('factCounter');
const factsGallery = document.getElementById('factsGallery');
const factContainer = document.getElementById('factContainer');

// Event listeners
nextBtn.addEventListener('click', showNextFact);
resetBtn.addEventListener('click', showAllFacts);

// Cargar datos curiosos
async function loadCatFacts() {
    try {
        showLoading(true);
        hideError();

        // Cargar múltiples datos curiosos
        const promises = [];
        for (let i = 0; i < 10; i++) {
            promises.push(fetch(`${API_URL}/fact`));
        }

        const responses = await Promise.all(promises);
        const data = await Promise.all(responses.map(res => res.json()));

        catFacts = data.map(item => item.fact).filter(fact => fact);

        if (catFacts.length > 0) {
            currentFactIndex = 0;
            showCurrentFact();
        } else {
            showError('No se pudieron cargar los datos curiosos');
        }

        showLoading(false);
    } catch (error) {
        console.error('Error:', error);
        showError('Error al cargar datos curiosos: ' + error.message);
        showLoading(false);
    }
}

// Mostrar el dato actual
function showCurrentFact() {
    if (catFacts.length === 0) return;

    factBox.textContent = catFacts[currentFactIndex];
    factCounter.textContent = `Dato ${currentFactIndex + 1} de ${catFacts.length}`;

    // Animar
    factBox.style.animation = 'none';
    setTimeout(() => {
        factBox.style.animation = 'slideIn 0.5s ease-in-out';
    }, 10);
}

// Mostrar siguiente dato
function showNextFact() {
    if (catFacts.length === 0) return;

    currentFactIndex = (currentFactIndex + 1) % catFacts.length;
    showCurrentFact();
}

// Mostrar todos los datos en galería
function showAllFacts() {
    if (catFacts.length === 0) return;

    factContainer.style.display = 'none';
    factsGallery.style.display = 'grid';
    factsGallery.innerHTML = '';

    catFacts.forEach((fact, index) => {
        const card = document.createElement('div');
        card.className = 'fact-card';
        card.innerHTML = `
            <p><strong>#${index + 1}</strong></p>
            <p>${fact}</p>
        `;
        factsGallery.appendChild(card);
    });

    // Agregar botón para volver
    const backButton = document.createElement('button');
    backButton.textContent = '← Volver a Vista Individual';
    backButton.className = 'btn-secondary';
    backButton.style.marginTop = '20px';
    backButton.style.gridColumn = '1 / -1';
    backButton.addEventListener('click', () => {
        factsGallery.style.display = 'none';
        factContainer.style.display = 'block';
    });
    factsGallery.appendChild(backButton);
}

// Cargar más datos cuando se alcance el final
async function loadMoreFacts() {
    try {
        const response = await fetch(`${API_URL}/fact`);
        const data = await response.json();

        if (data.fact) {
            catFacts.push(data.fact);
        }
    } catch (error) {
        console.error('Error al cargar más datos:', error);
    }
}

// Funciones auxiliares
function showLoading(show) {
    loading.style.display = show ? 'block' : 'none';
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function hideError() {
    errorDiv.style.display = 'none';
}

// Inicializar
loadCatFacts();
