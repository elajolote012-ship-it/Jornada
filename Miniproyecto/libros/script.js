// Variables globales
let books = [];
const API_URL = 'https://openlibrary.org/search.json';

// Elementos del DOM
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const gallery = document.getElementById('gallery');
const loading = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const noResults = document.getElementById('noResults');
const resultsCount = document.getElementById('resultsCount');

// Filtros rápidos
const filterFiction = document.getElementById('filterFiction');
const filterScience = document.getElementById('filterScience');
const filterFantasy = document.getElementById('filterFantasy');

// Event listeners
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

filterFiction.addEventListener('click', () => searchBooks('fiction'));
filterScience.addEventListener('click', () => searchBooks('science'));
filterFantasy.addEventListener('click', () => searchBooks('fantasy'));

// Función de búsqueda principal
async function handleSearch() {
    const query = searchInput.value.trim();
    if (query === '') {
        showError('Por favor ingresa un término de búsqueda');
        return;
    }
    await searchBooks(query);
}

// Buscar libros
async function searchBooks(query) {
    try {
        showLoading(true);
        hideError();

        const url = `${API_URL}?q=${encodeURIComponent(query)}&limit=20`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Error al buscar libros');
        }

        const data = await response.json();

        books = data.docs || [];

        if (books.length === 0) {
            showNoResults();
            resultsCount.style.display = 'none';
        } else {
            hideNoResults();
            resultsCount.textContent = `Se encontraron ${books.length} libros`;
            resultsCount.style.display = 'block';
            displayBooks();
        }

        showLoading(false);
    } catch (error) {
        console.error('Error:', error);
        showError('Error al buscar libros: ' + error.message);
        showLoading(false);
    }
}

// Mostrar libros
function displayBooks() {
    gallery.innerHTML = '';

    books.forEach(book => {
        const card = createBookCard(book);
        gallery.appendChild(card);
    });
}

// Crear tarjeta de libro
function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book-card';

    // Obtener información del libro
    const title = book.title || 'Título no disponible';
    const author = book.author_name ? book.author_name[0] : 'Autor desconocido';
    const year = book.first_publish_year || 'Año desconocido';
    const editions = book.edition_count || 'N/A';
    const isbn = book.isbn ? book.isbn[0] : '';

    // Generar portada
    let coverHtml = '📖';
    if (book.cover_id) {
        const coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`;
        coverHtml = `<img src="${coverUrl}" alt="${title}" onerror="this.replaceWith('📖')">`;
    }

    // Generar link de libro
    const bookLink = book.key 
        ? `https://openlibrary.org${book.key}`
        : 'javascript:void(0)';

    card.innerHTML = `
        <div class="book-cover">
            ${coverHtml}
        </div>
        <div class="book-info">
            <h3 class="book-title">${title}</h3>
            <p class="book-author">👤 ${author}</p>
            <p class="book-year">📅 ${year}</p>
            <p class="book-edition">📕 Ediciones: ${editions}</p>
            ${isbn ? `<p class="book-edition">ISBN: ${isbn}</p>` : ''}
            <a href="${bookLink}" target="_blank" class="book-link">Ver en Open Library</a>
        </div>
    `;

    return card;
}

// Funciones auxiliares
function showLoading(show) {
    loading.style.display = show ? 'block' : 'none';
}

function showNoResults() {
    noResults.style.display = 'block';
}

function hideNoResults() {
    noResults.style.display = 'none';
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function hideError() {
    errorDiv.style.display = 'none';
}
