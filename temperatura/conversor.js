/**
 * Convierte una temperatura dada en grados Celsius a Fahrenheit y Kelvin.
 *
 * Fórmulas:
 *  - Fahrenheit = Celsius * 9/5 + 32
 *  - Kelvin = Celsius + 273.15
 *
 * La función valida que la entrada sea un número y devuelve un objeto
 * con las tres temperaturas redondeadas a 2 decimales.
 *
 * @param {number} celsius - Temperatura en grados Celsius.
 * @returns {{celsius: number, fahrenheit: number, kelvin: number}} Resultado con las tres unidades.
 * @throws {TypeError} Si la entrada no es un número válido.
 */
function convertCelsius(celsius) {
  // Validación básica: debe ser un número y no NaN
  if (typeof celsius !== 'number' || Number.isNaN(celsius)) {
    throw new TypeError('El valor de entrada debe ser un número válido.');
  }

  // Cálculos principales
  const fahrenheit = (celsius * 9 / 5) + 32;
  const kelvin = celsius + 273.15;

  // Función auxiliar para redondear a n decimales (por defecto 2)
  const round = (value, decimals = 2) => Number(value.toFixed(decimals));

  return {
    celsius: round(celsius, 2),
    fahrenheit: round(fahrenheit, 2),
    kelvin: round(kelvin, 2)
  };
}

// Ejemplos de uso (se pueden quitar o comentar cuando se importe en otro módulo)
if (typeof console !== 'undefined') {
  console.log('Ejemplo: 0 °C ->', convertCelsius(0));
  console.log('Ejemplo: 100 °C ->', convertCelsius(100));
}

// Exportaciones: compatible con Node.js y con navegador (global `window`)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = convertCelsius;
}

if (typeof window !== 'undefined') {
  window.convertCelsius = convertCelsius;
}

/*
Ejemplo de resultados en consola:
 - convertCelsius(0)   -> { celsius: 0.00, fahrenheit: 32.00, kelvin: 273.15 }
 - convertCelsius(25)  -> { celsius: 25.00, fahrenheit: 77.00, kelvin: 298.15 }
 - convertCelsius(-40) -> { celsius: -40.00, fahrenheit: -40.00, kelvin: 233.15 }
*/
