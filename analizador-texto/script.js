// Analizador de Texto - script.js
// Este script actualiza las estadísticas en tiempo real mientras el usuario escribe.

document.addEventListener('DOMContentLoaded', () => {
  // Referencias a elementos del DOM
  const input = document.getElementById('inputText');
  const charsWithEl = document.getElementById('charsWith');
  const charsNoEl = document.getElementById('charsNo');
  const wordsEl = document.getElementById('words');
  const sentencesEl = document.getElementById('sentences');
  const readTimeEl = document.getElementById('readTime');
  const clearBtn = document.getElementById('clearBtn');
  const copyBtn = document.getElementById('copyBtn');
  const notice = document.getElementById('notice');

  // Evento para actualizar en tiempo real usando addEventListener
  input.addEventListener('input', () => {
    try {
      updateStats(input.value);
    } catch (err) {
      showNotice('Error actualizando estadísticas.');
      console.error(err);
    }
  });

  // Limpiar texto y estadísticas
  clearBtn.addEventListener('click', () => {
    input.value = '';
    updateStats('');
    input.focus();
  });

  // Copiar estadísticas al portapapeles
  copyBtn.addEventListener('click', async () => {
    try {
      const text = input.value || '';
      if (text.trim().length === 0) {
        showNotice('No hay texto para analizar.');
        return;
      }
      const report = buildReport(text);
      await copyToClipboard(report);
      showNotice('Estadísticas copiadas al portapapeles.');
    } catch (err) {
      showNotice('No se pudo copiar.');
      console.error(err);
    }
  });

  // Inicializar vista
  updateStats('');

  // ---------- Funciones auxiliares ----------

  // Actualiza todos los contadores y la UI
  function updateStats(text) {
    const charsWith = countCharsWithSpaces(text);
    const charsNo = countCharsWithoutSpaces(text);
    const words = countWords(text);
    const sentences = countSentences(text);
    const readTime = estimateReadingTime(words);

    // Animar y actualizar los elementos con manejo de errores básico
    safeSetNumber(charsWithEl, charsWith);
    safeSetNumber(charsNoEl, charsNo);
    safeSetNumber(wordsEl, words);
    safeSetNumber(sentencesEl, sentences);
    safeSetText(readTimeEl, readTime);

    // Habilitar/deshabilitar botón copiar según contenido
    if (text.trim().length === 0) {
      copyBtn.disabled = true;
      copyBtn.style.opacity = 0.6;
      showNotice('');
    } else {
      copyBtn.disabled = false;
      copyBtn.style.opacity = 1;
      showNotice('');
    }
  }

  // Muestra un mensaje breve en la UI
  function showNotice(msg) {
    notice.textContent = msg || '';
  }

  // Pone un número en el elemento y dispara una animación breve
  function safeSetNumber(el, value) {
    try {
      el.textContent = value;
      animateNumber(el);
    } catch (err) {
      console.error('safeSetNumber:', err);
    }
  }

  // Pone texto plano en un elemento
  function safeSetText(el, value) {
    try {
      el.textContent = value;
      animateNumber(el);
    } catch (err) {
      console.error('safeSetText:', err);
    }
  }

  // Animación sutil: añadir clase y quitarla después
  function animateNumber(el) {
    el.classList.add('animate');
    setTimeout(() => el.classList.remove('animate'), 240);
  }

  // Construye el reporte de estadísticas en formato legible
  function buildReport(text) {
    const cWith = countCharsWithSpaces(text);
    const cNo = countCharsWithoutSpaces(text);
    const w = countWords(text);
    const s = countSentences(text);
    const rt = estimateReadingTime(w);

    return [`Estadísticas del texto`,
      `Caracteres (con espacios): ${cWith}`,
      `Caracteres (sin espacios): ${cNo}`,
      `Palabras: ${w}`,
      `Oraciones: ${s}`,
      `Tiempo estimado de lectura: ${rt}`].join('\n');
  }

  // Copiar al portapapeles con fallback
  async function copyToClipboard(text) {
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    // Fallback clásico
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
    } finally {
      document.body.removeChild(ta);
    }
  }

  // ---------- Contadores ----------

  // Cuenta caracteres incluyendo espacios
  function countCharsWithSpaces(text) {
    if (!text) return 0;
    return text.length;
  }

  // Cuenta caracteres sin contar espacios en blanco
  function countCharsWithoutSpaces(text) {
    if (!text) return 0;
    // Eliminar todos los espacios en blanco (incluye tab, salto de línea)
    return text.replace(/\s+/g, '').length;
  }

  // Cuenta palabras considerando múltiples espacios y saltos de línea
  function countWords(text) {
    if (!text) return 0;
    // Reemplazar caracteres especiales por espacios, luego dividir por espacios múltiples
    const trimmed = text.trim();
    if (trimmed.length === 0) return 0;
    // Dividir por cualquier secuencia de espacios en blanco
    const words = trimmed.split(/\s+/).filter(Boolean);
    return words.length;
  }

  // Cuenta oraciones basadas en puntos, signos de interrogación y exclamación
  function countSentences(text) {
    if (!text) return 0;
    // Uso una estrategia: dividir por terminadores (. ? !) y filtrar vacíos.
    // Evita contar puntos en abreviaturas con una heurística simple: eliminar secuencias de puntos mayores a 3 (elipsis) como separador.
    const cleaned = text.replace(/\.{2,}/g, '.');
    const parts = cleaned.split(/[.!?]+/).map(p => p.trim()).filter(Boolean);
    return parts.length;
  }

  // Estima tiempo de lectura: 200 palabras por minuto, devuelve texto "X min Y s" o "<1 min"
  function estimateReadingTime(words) {
    const wpm = 200;
    if (!words || words === 0) return '0 min';
    const minutes = words / wpm;
    const min = Math.floor(minutes);
    const sec = Math.round((minutes - min) * 60);
    if (min === 0 && sec > 0) return `${sec} s`;
    return `${min} min${sec > 0 ? ' ' + sec + ' s' : ''}`;
  }

});
