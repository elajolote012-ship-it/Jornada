// 🖱️ Ejercicio: DOM (Document Object Model)

// 1. Seleccionar elementos
// Pídele a la IA: "¿Cómo selecciono un elemento por su ID en JavaScript?"
// Selecciona el botón 'btnCambiarColor' y la 'miCaja'.
const btnCambiarColor = document.getElementById('btnCambiarColor');
const miCaja = document.getElementById('miCaja');
const btnCambiarTexto = document.getElementById('btnCambiarTexto');


// 2. Escuchar eventos (Clicks)
// Pídele a la IA: "¿Cómo hago que pase algo cuando hago click en un botón?"
btnCambiarColor.addEventListener('click', function() {
    // Código para cambiar el color de fondo de la caja
    miCaja.style.backgroundColor = 'red';
});

btnCambiarTexto.addEventListener('click', function() {
    // Código para cambiar el texto dentro de la caja
    miCaja.textContent = '¡Hola DOM!';
});


// 3. Modificar elementos
// Cuando den click en 'Cambiar Color', cambia el color de fondo de la caja a rojo.
// Pídele a la IA: "¿Cómo cambio el estilo background-color de un elemento con JS?"


// Reto:
// Haz que el botón 'Cambiar Texto' cambie lo que dice dentro de la caja por "¡Hola DOM!".
