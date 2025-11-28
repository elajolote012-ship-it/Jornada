//EJERCICIO: DETECTOR DE PALINDROMO
//Objetivo: crea una logica compleja encapsulada en una funcion.
//Un palindromo es una palabra i frase que se lee igual hacia adelante y hacia atras
//Ejemplos de palindromos: "anilina, "reconocer", "OJO"
//crea una funcion llamada es palidromo que reciba un texto y retorne si es palindromo y false si no lo es
function esPalindromo(texto) {
    // Convertir el texto a minúsculas y eliminar espacios y caracteres especiales
    const textoLimpio = texto.toLowerCase().replace(/[^a-z0-9]/g, '');
    // Invertir el texto limpio
    const textoInvertido = textoLimpio.split('').reverse().join('');
    // Comparar el texto limpio con el texto invertido
    return textoLimpio === textoInvertido;
}