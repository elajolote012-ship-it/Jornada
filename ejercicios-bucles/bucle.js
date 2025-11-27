// ejercicio: arrays y objetos

// 1. Arrays (listas)
// Crea una lista de tus 3 comidas favoritas. 
let comidasFavoritas = ['Pizza', 'Sushi', 'Tacos'];

//como agrego un elemento a un array en JS
comidasFavoritas.push('Helado');    

//muestra la lista en consola
console.log('Mis comidas favoritas son:', comidasFavoritas);

// 2. Objetos (Diccionarios/Fichas)
// Crea un objeto que te represente a ti (nombre, edad, si te gusta programar).
// ...existing code...
const yo = {
    nombre: "Sagit",
    edad: 25,
    gustaProgramar: true,
    habilidades : ['JavaScript', 'Python', 'C++']
}

// Acceso directo
console.log(yo.nombre)       // "Sagit"

// Notación de corchetes
console.log(yo['nombre'])    // "Sagit"

// Desestructuración
const { nombre } = yo
console.log(nombre)          // "Sagit"

// Opcional: si no estás seguro de que 'yo' exista
console.log(yo?.nombre)      // "Sagit" o undefined si 'yo' es null/undefined
// ...existing code...
console.log('Información personal:', yo);

// 3. Array de Objetos
// Crea una lista de 3 alumnos (objetos) con nombre y calificación.
let alumnos = [
    { nombre: 'Ana', calificacion: 90 },
    { nombre: 'Luis', calificacion: 85 },
    { nombre: 'Marta', calificacion: 95 }
];
console.log('Lista de alumnos:', alumnos);

// Escribe un bucle que recorra el array de alumnos e imprima solo los que aprobaron (calificación > 6)
for (let i = 0; i < alumnos.length; i++) {
    if (alumnos[i].calificacion > 6) {
        console.log(alumnos[i].nombre + ' aprobó con calificación: ' + alumnos[i].calificacion);
    }
}
