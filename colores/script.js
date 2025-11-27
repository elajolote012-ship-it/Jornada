// Generador de Colores Aleatorios - JavaScript vanilla

// Obtiene referencias a los elementos del DOM
const colorBox = document.getElementById('colorBox');
const hexCode = document.getElementById('hexCode');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const toast = document.getElementById('toast');

/**
 * Genera un color hexadecimal aleatorio en formato #RRGGBB.
 * @returns {string} Código hexadecimal (p. ej. "#A1B2C3")
 */
function randomHexColor(){
  const n = Math.floor(Math.random() * 0xffffff); // valor entre 0 y 0xFFFFFF
  const hex = n.toString(16).padStart(6, '0');
  return `#${hex.toUpperCase()}`;
}

/**
 * Aplica el color al `colorBox` y actualiza el texto con el código.
 * También ajusta el color del texto para mantener contraste.
 * @param {string} hex Código hexadecimal
 */
function applyColor(hex){
  colorBox.style.backgroundColor = hex;
  hexCode.textContent = hex;

  // Ajustar color del texto según brillo para legibilidad
  const rgb = hexToRgb(hex);
  if(rgb){
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    hexCode.style.color = brightness > 140 ? '#0b1220' : '#fff';
  }
}

/**
 * Convierte un código hex a un objeto RGB.
 * @param {string} hex '#RRGGBB'
 * @returns {{r:number,g:number,b:number}|null}
 */
function hexToRgb(hex){
  const m = /^#?([a-fA-F0-9]{6})$/.exec(hex);
  if(!m) return null;
  const int = parseInt(m[1], 16);
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}

/**
 * Copia el texto al portapapeles. Muestra una confirmación visual (toast).
 * Usa navigator.clipboard si está disponible, si no cae en fallback.
 * @param {string} text Texto a copiar
 */
async function copyToClipboard(text){
  try{
    if(navigator.clipboard && navigator.clipboard.writeText){
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback para navegadores antiguos
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta);
      ta.select(); document.execCommand('copy');
      document.body.removeChild(ta);
    }
    showToast(`Copiado: ${text}`);
  }catch(err){
    showToast('Error: no se pudo copiar');
    console.error('Copiar al portapapeles falló', err);
  }
}

/**
 * Muestra un mensaje breve tipo "toast" en pantalla.
 * @param {string} message Mensaje a mostrar
 */
function showToast(message){
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(()=>{
    toast.classList.remove('show');
  }, 1700);
}

// Eventos de botones
generateBtn.addEventListener('click', ()=>{
  const hex = randomHexColor();
  applyColor(hex);
});

copyBtn.addEventListener('click', ()=>{
  copyToClipboard(hexCode.textContent.trim());
});

// Generar un color inicial al cargar la página
document.addEventListener('DOMContentLoaded', ()=>{
  const initial = randomHexColor();
  applyColor(initial);
});
