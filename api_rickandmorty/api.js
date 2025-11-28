// Variables globales
let allCharacters = [];
let filteredCharacters = [];
let currentPage = 1;
let charactersPerPage = 6;
let totalPages = 1;
let searchTerm = '';

// URLs de la API
const API_URL = 'https://rickandmortyapi.com/api/character';

// Elementos del DOM
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const grid = document.getElementById('grid');
const pagination = document.getElementById('pagination');
const loading = document.getElementById('loading');
const noResults = document.getElementById('noResults');
const errorDiv = document.getElementById('error');
const pageInfo = document.getElementById('pageInfo');

// Event listeners
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Función principal para obtener personajes
async function fetchCharacters(url = API_URL) {
    try {
        showLoading(true);
        hideError();
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Inicializar array de personajes
        allCharacters = data.results || [];
        
        // Si hay más páginas, obtenerlas todas
        if (data.info.next) {
            await fetchAllPages(data.info.next, allCharacters);
        }
        
        filteredCharacters = allCharacters;
        currentPage = 1;
        totalPages = Math.ceil(filteredCharacters.length / charactersPerPage);
        
        displayCharacters();
        generatePagination();
        showLoading(false);
        
    } catch (error) {
        console.error('Error al obtener personajes:', error);
        showError(`Error al cargar los personajes: ${error.message}`);
        showLoading(false);
    }
}

// Función para obtener todas las páginas de la API
async function fetchAllPages(nextUrl, characters) {
    try {
        const response = await fetch(nextUrl);
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        characters.push(...(data.results || []));
        
        // Si hay más páginas, continuar
        if (data.info.next) {
            await fetchAllPages(data.info.next, characters);
        }
    } catch (error) {
        console.error('Error al obtener más páginas:', error);
    }
}

// Función para buscar personajes
function handleSearch() {
    searchTerm = searchInput.value.trim().toLowerCase();
    currentPage = 1;
    
    if (searchTerm === '') {
        filteredCharacters = [...allCharacters];
    } else {
        filteredCharacters = allCharacters.filter(character => 
            character.name.toLowerCase().includes(searchTerm)
        );
    }
    
    totalPages = Math.ceil(filteredCharacters.length / charactersPerPage);
    
    if (filteredCharacters.length === 0) {
        showNoResults();
    } else {
        hideNoResults();
        displayCharacters();
        generatePagination();
    }
}

// Función para mostrar personajes en la página actual
function displayCharacters() {
    grid.innerHTML = '';
    
    if (filteredCharacters.length === 0) {
        showNoResults();
        return;
    }
    
    hideNoResults();
    
    const startIndex = (currentPage - 1) * charactersPerPage;
    const endIndex = startIndex + charactersPerPage;
    const charactersToDisplay = filteredCharacters.slice(startIndex, endIndex);
    
    // Actualizar información de página
    pageInfo.textContent = `Mostrando ${startIndex + 1} - ${Math.min(endIndex, filteredCharacters.length)} de ${filteredCharacters.length} personajes`;
    
    charactersToDisplay.forEach(character => {
        const card = createCard(character);
        grid.appendChild(card);
    });
}

// Función para crear una tarjeta de personaje
function createCard(character) {
    const card = document.createElement('div');
    card.className = 'card';
    
    // Determinar clase de estado
    const statusClass = character.status.toLowerCase();
    
    card.innerHTML = `
        <img src="${character.image}" alt="${character.name}" class="card-image">
        <div class="card-content">
            <h2 class="card-title">${character.name}</h2>
            <div class="card-info">
                <div class="info-item">
                    <span class="info-label">Estado:</span>
                    <span class="status ${statusClass}">${character.status}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Especie:</span>
                    <span class="info-value">${character.species}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Ubicación:</span>
                    <span class="info-value">${character.location.name}</span>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Función para generar botones de paginación
function generatePagination() {
    pagination.innerHTML = '';
    
    if (totalPages <= 1) {
        return;
    }
    
    // Botón anterior
    const prevBtn = createPaginationButton('← Anterior', currentPage > 1, () => {
        if (currentPage > 1) {
            currentPage--;
            displayCharacters();
            generatePagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    pagination.appendChild(prevBtn);
    
    // Botones de páginas
    const maxButtonsToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxButtonsToShow - 1);
    
    if (endPage - startPage + 1 < maxButtonsToShow) {
        startPage = Math.max(1, endPage - maxButtonsToShow + 1);
    }
    
    // Primera página
    if (startPage > 1) {
        const firstBtn = createPaginationButton('1', true, () => {
            currentPage = 1;
            displayCharacters();
            generatePagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        pagination.appendChild(firstBtn);
        
        if (startPage > 2) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            dots.style.color = 'white';
            dots.style.padding = '10px';
            pagination.appendChild(dots);
        }
    }
    
    // Páginas en rango
    for (let i = startPage; i <= endPage; i++) {
        const btn = createPaginationButton(i.toString(), true, () => {
            currentPage = i;
            displayCharacters();
            generatePagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        if (i === currentPage) {
            btn.classList.add('active');
        }
        
        pagination.appendChild(btn);
    }
    
    // Última página
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            dots.style.color = 'white';
            dots.style.padding = '10px';
            pagination.appendChild(dots);
        }
        
        const lastBtn = createPaginationButton(totalPages.toString(), true, () => {
            currentPage = totalPages;
            displayCharacters();
            generatePagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        pagination.appendChild(lastBtn);
    }
    
    // Botón siguiente
    const nextBtn = createPaginationButton('Siguiente →', currentPage < totalPages, () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayCharacters();
            generatePagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    pagination.appendChild(nextBtn);
}

// Función auxiliar para crear botones de paginación
function createPaginationButton(text, enabled, onClick) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.disabled = !enabled;
    
    if (enabled) {
        btn.addEventListener('click', onClick);
    }
    
    return btn;
}

// Funciones auxiliares de UI
function showLoading(show) {
    loading.classList.toggle('active', show);
}

function showNoResults() {
    noResults.style.display = 'block';
}

function hideNoResults() {
    noResults.style.display = 'none';
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.add('active');
}

function hideError() {
    errorDiv.classList.remove('active');
}

// Cargar personajes al iniciar
fetchCharacters();
