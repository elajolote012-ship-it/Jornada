//suma dos numeros en js
function suma(a, b) {
    return a + b;
}

function sumaEnteros(a, b) {
    const x = Number(a);
    const y = Number(b);
    if (!Number.isInteger(x) || !Number.isInteger(y)) {
        throw new TypeError('Ambos argumentos deben ser enteros');
    }
    return x + y;
}

// uso desde la línea de comandos: node index.js 3 5
if (require.main === module) {
    const [, , a, b] = process.argv;
    try {
        console.log(sumaEnteros(a, b));
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

module.exports = { sumaEnteros };

//ejercicio 1
let caja = 5;       // crear caja y poner el número 5
caja = 10;          // cambiar el contenido de la misma caja
const cajaFija = { item: 'libro' }; // caja con referencia a un objeto
const otraEtiqueta = cajaFija;      // otra etiqueta que apunta al mismo objeto
otraEtiqueta.item = 'revista';     // cambia el contenido del objeto compartido
