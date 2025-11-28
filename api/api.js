// 🌐 POKÉDEX - Consumo de APIs con fetch

const inputPokemon = document.getElementById('inputPokemon');
const btnBuscar = document.getElementById('btnBuscar');
const gridDiv = document.getElementById('grid');
const paginationDiv = document.getElementById('pagination');
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('closeBtn');
const modalDetails = document.getElementById('modalDetails');
const noResults = document.getElementById('noResults');

let pokemonList = [];
let filteredList = [];
let currentPage = 1;
const itemsPerPage = 20;

// Obtener lista completa de Pokémon
async function obtenerListaPokemon() {
    try {
        const respuesta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const datos = await respuesta.json();
        pokemonList = datos.results;
        filteredList = pokemonList;
        currentPage = 1;
        renderizar();
    } catch (error) {
        console.error('Error al cargar Pokémon:', error);
    }
}

// Obtener detalles de un Pokémon específico
async function obtenerDetallePokemon(url) {
    try {
        const respuesta = await fetch(url);
        return await respuesta.json();
    } catch (error) {
        console.error('Error al obtener detalles:', error);
        return null;
    }
}

// Renderizar grid de Pokémon para la página actual
function renderizar() {
    gridDiv.innerHTML = '';
    
    if (filteredList.length === 0) {
        noResults.style.display = 'block';
        paginationDiv.innerHTML = '';
        return;
    }
    noResults.style.display = 'none';

    const inicio = (currentPage - 1) * itemsPerPage;
    const fin = inicio + itemsPerPage;
    const pokemonPagina = filteredList.slice(inicio, fin);

    pokemonPagina.forEach((pokemon) => {
        const id = pokemon.url.split('/')[6];
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png" alt="${pokemon.name}">
            <h3>${pokemon.name}</h3>
            <p>#${String(id).padStart(3, '0')}</p>
        `;
        card.addEventListener('click', () => abrirModal(pokemon.url));
        gridDiv.appendChild(card);
    });

    renderizarPaginacion();
}

// Renderizar botones de paginación
function renderizarPaginacion() {
    paginationDiv.innerHTML = '';
    const totalPages = Math.ceil(filteredList.length / itemsPerPage);

    const btnAnterior = document.createElement('button');
    btnAnterior.textContent = '← Anterior';
    btnAnterior.disabled = currentPage === 1;
    btnAnterior.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderizar();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    paginationDiv.appendChild(btnAnterior);

    const info = document.createElement('span');
    info.style.alignSelf = 'center';
    info.style.color = 'white';
    info.textContent = `Página ${currentPage} de ${totalPages}`;
    paginationDiv.appendChild(info);

    const btnSiguiente = document.createElement('button');
    btnSiguiente.textContent = 'Siguiente →';
    btnSiguiente.disabled = currentPage === totalPages;
    btnSiguiente.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderizar();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    paginationDiv.appendChild(btnSiguiente);
}

// Abrir modal con detalles completos
async function abrirModal(urlPokemon) {
    const datos = await obtenerDetallePokemon(urlPokemon);
    if (!datos) return;

    const tipos = datos.types.map(t => t.type.name).join(', ');
    const altura = (datos.height / 10).toFixed(1) + ' m';
    const peso = (datos.weight / 10).toFixed(1) + ' kg';
    const hp = datos.stats[0].base_stat;
    const ataque = datos.stats[1].base_stat;
    const defensa = datos.stats[2].base_stat;
    const velocidad = datos.stats[5].base_stat;

    let typesHtml = '';
    datos.types.forEach(t => {
        typesHtml += `<span class="type-badge">${t.type.name}</span>`;
    });

    modalDetails.innerHTML = `
        <img class="modal-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${datos.id}.png" alt="${datos.name}">
        <h2>#${String(datos.id).padStart(3, '0')} ${datos.name}</h2>
        <div class="types">${typesHtml}</div>
        <div class="stats">
            <div class="stat-item"><strong>Altura</strong><span>${altura}</span></div>
            <div class="stat-item"><strong>Peso</strong><span>${peso}</span></div>
            <div class="stat-item"><strong>Ataque</strong><span>${ataque}</span></div>
            <div class="stat-item"><strong>Defensa</strong><span>${defensa}</span></div>
            <div class="stat-item"><strong>HP</strong><span>${hp}</span></div>
            <div class="stat-item"><strong>Velocidad</strong><span>${velocidad}</span></div>
        </div>
        <p><strong>Tipos:</strong> ${tipos}</p>
    `;
    modal.classList.add('show');
}

// Cerrar modal
function cerrarModal() {
    modal.classList.remove('show');
}

// Buscar Pokémon por nombre
function buscar() {
    const termino = inputPokemon.value.toLowerCase().trim();
    if (termino === '') {
        filteredList = pokemonList;
    } else {
        filteredList = pokemonList.filter(p => p.name.includes(termino));
    }
    currentPage = 1;
    renderizar();
}

// Event listeners
btnBuscar.addEventListener('click', buscar);
inputPokemon.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') buscar();
});
closeBtn.addEventListener('click', cerrarModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) cerrarModal();
});

// Cargar Pokémon al iniciar
obtenerListaPokemon();