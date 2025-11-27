// Quiz JavaScript
// Contiene: array de preguntas, funciones para mostrar pregunta,
// validar respuesta, feedback inmediato, contador de puntos,
// cálculo de porcentaje, desactivar botones, y transición con delay.

// Array de objetos con preguntas, opciones y respuesta correcta (índice)
const questions = [
  {
    pregunta: '¿Cuál es la forma correcta de declarar una variable que no será reasignada?',
    opciones: ['var x = 5;', 'let x = 5;', 'const x = 5;', 'x = 5;'],
    correcta: 2,
    comentario: 'Usa `const` para valores que no cambiarán. `let` permite re-asignación.'
  },
  {
    pregunta: '¿Qué método convierte un objeto a una cadena JSON?',
    opciones: ['JSON.parse()', 'JSON.stringify()', 'toString()', 'Object.toJSON()'],
    correcta: 1,
    comentario: '`JSON.stringify(obj)` convierte un objeto en texto JSON.'
  },
  {
    pregunta: '¿Cuál es el resultado de `typeof null` en JavaScript?',
    opciones: ['"null"', '"object"', '"undefined"', '"number"'],
    correcta: 1,
    comentario: 'Es una curiosidad histórica: `typeof null` devuelve "object".'
  },
  {
    pregunta: '¿Cómo se agrega un manejador de eventos click a un botón con id "miBoton"?',
    opciones: ['miBoton.onclick = funcion;', 'addEvent(miBoton, "click", fn);', 'document.getElementById("miBoton").addEventListener("click", fn);', 'document.on("click", "#miBoton", fn);'],
    correcta: 2,
    comentario: 'Usa `addEventListener` para añadir escuchas de eventos.'
  },
  {
    pregunta: '¿Qué devuelve `Array.prototype.map()`?',
    opciones: ['Un solo valor', 'Un nuevo array transformado', 'Modifica el array original', 'Ninguna de las anteriores'],
    correcta: 1,
    comentario: '`map` crea un nuevo array aplicando una función a cada elemento.'
  }
];

// Estado del quíz
let current = 0;
let score = 0;
let acceptingAnswers = true;

// Elementos del DOM
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const questionCounter = document.getElementById('question-counter');
const questionText = document.getElementById('question-text');
const optionsDiv = document.getElementById('options');
const progressBar = document.getElementById('progress-bar');
const scoreNumber = document.getElementById('score-number');
const totalNumber = document.getElementById('total-number');
const percentNumber = document.getElementById('percent-number');
const messageText = document.getElementById('message-text');
const retryBtn = document.getElementById('retry-btn');

// Inicializar totales
totalNumber.textContent = questions.length;

// Función para calcular porcentaje
function calcularPorcentaje(aciertos, total){
  if(total === 0) return 0;
  return Math.round((aciertos / total) * 100);
}

// Mostrar pregunta actual
function mostrarPregunta(){
  acceptingAnswers = true;
  const q = questions[current];
  questionText.textContent = q.pregunta;
  questionCounter.textContent = `Pregunta ${current + 1} de ${questions.length}`;

  // Actualizar barra de progreso
  const percent = ((current) / questions.length) * 100;
  progressBar.style.width = `${percent}%`;

  // Limpiar opciones anteriores
  optionsDiv.innerHTML = '';

  // Crear botones de respuesta
  q.opciones.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.setAttribute('data-index', idx);
    btn.addEventListener('click', onOptionClick);
    optionsDiv.appendChild(btn);
  });
}

// Manejo del click en una opción
function onOptionClick(e){
  if(!acceptingAnswers) return;
  acceptingAnswers = false; // evitar clicks múltiples

  const selected = e.currentTarget;
  const selectedIndex = parseInt(selected.getAttribute('data-index'), 10);
  const correctIndex = questions[current].correcta;

  // Validar respuesta
  if(selectedIndex === correctIndex){
    selected.classList.add('correct');
    score++;
  } else {
    selected.classList.add('incorrect');
    // resaltar la correcta
    const botones = Array.from(optionsDiv.querySelectorAll('.option-btn'));
    const correctBtn = botones.find(b => parseInt(b.getAttribute('data-index'),10) === correctIndex);
    if(correctBtn) correctBtn.classList.add('correct');
  }

  // Desactivar todas las opciones
  Array.from(optionsDiv.querySelectorAll('.option-btn')).forEach(b => b.classList.add('disabled'));

  // Mostrar feedback explicativo (console, también podría añadirse a UI)
  console.log('Comentario:', questions[current].comentario);

  // Después de un pequeño delay, pasar a la siguiente pregunta o resultados
  setTimeout(() => {
    current++;
    if(current < questions.length){
      mostrarPregunta();
    } else {
      mostrarResultados();
    }
    acceptingAnswers = true;
  }, 900); // delay de transición (900ms)
}

// Mostrar pantalla de resultados
function mostrarResultados(){
  quizScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');

  // Actualizar métricas
  scoreNumber.textContent = score;
  percentNumber.textContent = `${calcularPorcentaje(score, questions.length)}%`;

  // Mensaje según desempeño
  const percent = calcularPorcentaje(score, questions.length);
  let mensaje = 'Puedes mejorar';
  if(percent >= 85) mensaje = 'Excelente';
  else if(percent >= 60) mensaje = 'Bien';
  messageText.textContent = mensaje;

  // Animación sutil en los números
  scoreNumber.animate([{transform:'scale(0.85)'},{transform:'scale(1)'}],{duration:420,easing:'cubic-bezier(.22,.9,.36,1)'});
  percentNumber.animate([{opacity:0},{opacity:1}],{duration:420});
}

// Reiniciar el quíz
function reiniciar(){
  current = 0;
  score = 0;
  scoreNumber.textContent = '0';
  percentNumber.textContent = '0%';
  messageText.textContent = '—';
  resultScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
}

// Start del quíz: ocultar inicio y mostrar primera pregunta
startBtn.addEventListener('click', () => {
  startScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');
  // reset por si se inicia otra vez
  current = 0; score = 0;
  mostrarPregunta();
});

retryBtn.addEventListener('click', () => {
  reiniciar();
});

// Comentarios explicativos en cada sección del archivo:
// - questions: aquí definimos las preguntas, opciones, índice correcto y un comentario explicativo.
// - mostrarPregunta: renderiza la pregunta actual, actualiza contador y barra de progreso.
// - onOptionClick: valida la respuesta, aplica clases para feedback (correct/incorrect), desactiva botones y avanza con delay.
// - mostrarResultados: calcula porcentaje, selecciona mensaje según desempeño y anima los valores.
// - reiniciar: pone todo a estado inicial para volver a jugar.
