// Variables globales
let breeds = [];
let selectedBreed = '';
const API_URL = 'https://dog.ceo/api';

// Elementos del DOM
const breedSelect = document.getElementById('breedSelect');
const randomBtn = document.getElementById('randomBtn');
const loadBtn = document.getElementById('loadBtn');
const gallery = document.getElementById('gallery');
const loading = document.getElementById('loading');
const errorDiv = document.getElementById('error');

// Event listeners
breedSelect.addEventListener('change', (e) => {
    selectedBreed = e.target.value;
});

randomBtn.addEventListener('click', loadRandomDog);
loadBtn.addEventListener('click', loadDogsByBreed);

// Cargar razas disponibles
async function loadBreeds() {
    try {
        showLoading(true);
        hideError();

        const response = await fetch(`${API_URL}/breeds/list/all`);
        
        if (!response.ok) {
            throw new Error('Error al cargar las razas');
        }

        const data = await response.json();
        
        if (data.status === 'success') {
            breeds = Object.keys(data.message);
            populateBreedSelect();
            showLoading(false);
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Error al cargar las razas: ' + error.message);
        showLoading(false);
    }
}

// Poblar el select con las razas
function populateBreedSelect() {
    breedSelect.innerHTML = '<option value="">Selecciona una raza</option>';
    
    breeds.forEach(breed => {
        const option = document.createElement('option');
        option.value = breed;
        option.textContent = breed.charAt(0).toUpperCase() + breed.slice(1);
        breedSelect.appendChild(option);
    });
}

// Cargar un perro aleatorio
async function loadRandomDog() {
    try {
        showLoading(true);
        hideError();

        const response = await fetch(`${API_URL}/breeds/image/random/6`);
        
        if (!response.ok) {
            throw new Error('Error al cargar perros');
        }

        const data = await response.json();
        
        if (data.status === 'success') {
            displayDogs(data.message);
        }

        showLoading(false);
    } catch (error) {
        console.error('Error:', error);
        showError('Error al cargar perros: ' + error.message);
        showLoading(false);
    }
}

// Cargar perros por raza
async function loadDogsByBreed() {
    if (!selectedBreed) {
        showError('Por favor selecciona una raza');
        return;
    }

    try {
        showLoading(true);
        hideError();

        const response = await fetch(`${API_URL}/breed/${selectedBreed}/images/random/6`);
        
        if (!response.ok) {
            throw new Error('Error al cargar perros de esta raza');
        }

        const data = await response.json();
        
        if (data.status === 'success') {
            displayDogs(data.message);
        }

        showLoading(false);
    } catch (error) {
        console.error('Error:', error);
        showError('Error al cargar perros: ' + error.message);
        showLoading(false);
    }
}

// Mostrar perros en la galería
function displayDogs(images) {
    gallery.innerHTML = '';

    images.forEach(imageUrl => {
        const card = document.createElement('div');
        card.className = 'dog-card';

        // Extraer raza de la URL
        const breedMatch = imageUrl.match(/\/([^\/]+)\//) || ['', 'Perro'];
        const breed = breedMatch[1].replace(/-/g, ' ');

        card.innerHTML = `
            <img src="${imageUrl}" alt="Perro de raza ${breed}" loading="lazy">
            <div class="dog-info">
                <div class="dog-breed">${breed}</div>
            </div>
        `;

        gallery.appendChild(card);
    });
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
loadBreeds();
