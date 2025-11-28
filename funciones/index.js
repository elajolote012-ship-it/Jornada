//Ejercicio: Area y Volumenes
//Objetivo: Crear multiples munltiples funciones y reutilizables
//Crea una funcion para calcular el area de un circulo dado su raduio

/**
 * Calcula el área de un círculo dado su radio.
 *
 * @param {number} radio - Radio del círculo en unidades lineales. Si se proporciona un número negativo,
 *                         el resultado será equivalente al uso de su valor absoluto.
 * @returns {number} El área del círculo en unidades cuadradas.
 * @example
 * // devuelve aproximadamente 78.53981633974483
 * areaCirculo(5);
 */
function areaCirculo(radio) {
    return Math.PI * Math.pow(radio, 2);
}

//Crea una funcion para calcular el area de un rectangulo dado su base y altura
/**
 * Calcula el área de un rectángulo multiplicando su base por su altura.
 * 
 * @param {number} base - La base del rectángulo en unidades.
 * @param {number} altura - La altura del rectángulo en unidades.
 * @returns {number} El área del rectángulo (base × altura).
 * 
 * @example
 * // Calcula el área de un rectángulo con base 5 y altura 3
 * const area = areaRectangulo(5, 3);
 * console.log(area); // Output: 15
 */
function areaRectangulo(base, altura) {
    return base * altura;
}

//crea una funcion para calcular el volumen de un cilindro
//crea la funcion 'calcularvolumencilindro' reautilizando la funcion 'areaCirculo'
/**
 * Calcula el volumen de un cilindro.
 * 
 * @param {number} radio - El radio de la base del cilindro en unidades.
 * @param {number} altura - La altura del cilindro en unidades.
 * @returns {number} El volumen del cilindro en unidades cúbicas.
 * 
 * @example
 * // Calcula el volumen de un cilindro con radio 5 y altura 10
 * const volumen = volumenCilindro(5, 10);
 * console.log(volumen); // Resultado: 785.3981633974483
 */
function volumenCilindro(radio, altura) {
    const areaBase = areaCirculo(radio);
    return areaBase * altura;
}

//crea una funcion para calcular una derivada simple de una funcion polinomual de grado n
function
derivadaPolinomial(coeficientes) {
    const derivada = [];
    const grado = coeficientes.length - 1;

    for (let i = 0; i < grado; i++) {
        derivada.push(coeficientes[i] * (grado - i));
    }
    return derivada;
} 