// Reloj digital con alarma - JavaScript vanilla
// Flujo general:
// 1. Actualiza reloj y fecha cada segundo.
// 2. Al establecer una alarma se calcula la fecha objetivo (hoy o mañana si ya pasó).
// 3. Se compara la hora actual con la fecha objetivo en cada tick y, si coincide, suena la alarma.

// --- Selectores DOM
const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const greetingEl = document.getElementById('greeting');
const alarmInput = document.getElementById('alarmTimeInput');
const setBtn = document.getElementById('setAlarmBtn');
const clearBtn = document.getElementById('clearAlarmBtn');
const alarmStatus = document.getElementById('alarmStatus');
const alarmIndicator = document.getElementById('alarmIndicator');
const notificationArea = document.getElementById('notificationArea');

// --- Estado de la aplicación
let alarmDate = null;        // Date objeto indicando cuándo debe sonar la alarma
let alarmTriggered = false;  // Bandera para evitar múltiples disparos
let audioCtx = null;         // WebAudio context
let oscillator = null;

// Nombres en español
const daysES = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
const monthsES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

// Añade cero a la izquierda
function pad(v){
  return v.toString().padStart(2,'0');
}

// Formatea una Date a HH:MM:SS
function formatTime(d){
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// Formatea la fecha en el formato: Día, DD de Mes de YYYY
function formatDate(d){
  return `${daysES[d.getDay()]}, ${pad(d.getDate())} de ${monthsES[d.getMonth()]} de ${d.getFullYear()}`;
}

// Determina saludo según la hora
function getGreeting(hour){
  if(hour >= 6 && hour < 12) return 'Buenos días';
  if(hour >= 12 && hour < 20) return 'Buenas tardes';
  return 'Buenas noches';
}

// Actualiza reloj y verifica alarma
function tick(){
  const now = new Date();
  timeEl.textContent = formatTime(now);
  dateEl.textContent = formatDate(now);
  greetingEl.textContent = `${getGreeting(now.getHours())}`;

  // Si hay una alarma establecida y aún no se desencadenó, comprobar si debemos sonar
  if(alarmDate && !alarmTriggered){
    if(now >= alarmDate){
      triggerAlarm();
    }
  }
}

// Establece la alarma a partir del input (validando que exista una hora)
function setAlarm(){
  const value = alarmInput.value; // formato "HH:MM" o "HH:MM:SS"
  if(!value){
    showStatus('Selecciona una hora válida para la alarma', true);
    return;
  }

  const parts = value.split(':').map(Number);
  const now = new Date();
  const target = new Date(now);
  target.setHours(parts[0] || 0, parts[1] || 0, parts[2] || 0, 0);

  // Si la hora ya pasó hoy, programar para mañana (sigue siendo futuro)
  if(target <= now){
    target.setDate(target.getDate() + 1);
  }

  // Validación mínima: la alarma debe quedar en el futuro
  if(target - now < 1000){
    showStatus('La hora debe ser en el futuro.', true);
    return;
  }

  alarmDate = target;
  alarmTriggered = false;
  updateAlarmUI(true);
  showStatus(`Alarma establecida para ${formatTime(alarmDate)} (${formatDate(alarmDate)})`);
}

// Cancela la alarma actual
function clearAlarm(){
  if(alarmDate || alarmTriggered){
    stopSound();
  }
  alarmDate = null;
  alarmTriggered = false;
  updateAlarmUI(false);
  showStatus('Alarma cancelada');
}

// Mostrar estado en la UI
function showStatus(msg, isError=false){
  alarmStatus.textContent = msg;
  notificationArea.textContent = msg;
  if(isError){
    notificationArea.classList.add('show');
  } else {
    notificationArea.classList.remove('show');
  }
}

// Actualiza el indicador visual de alarma activa
function updateAlarmUI(active){
  if(active){
    alarmIndicator.classList.add('active');
  } else {
    alarmIndicator.classList.remove('active');
    notificationArea.classList.remove('show');
    document.querySelector('.time').classList.remove('alarm-ring');
  }
}

// Inicia sonido y notificación visual cuando suena la alarma
function triggerAlarm(){
  alarmTriggered = true;
  // Mostrar notificación visual
  notificationArea.textContent = '¡Alarma! ⏰';
  notificationArea.classList.add('show');
  document.querySelector('.time').classList.add('alarm-ring');

  // Reproducir un pitido con WebAudio (si está permitido)
  try{
    playBeep(5); // suena durante 5 segundos
  }catch(e){
    // si WebAudio falla, usar alert como fallback
    alert('¡Alarma!');
  }

  // Auto-desactivar la alarma después de sonar
  setTimeout(()=>{
    clearAlarm();
  }, 7000);
}

// Reproduce un beep durante `durationSec` segundos usando WebAudio
function playBeep(durationSec=3){
  if(!window.AudioContext && !window.webkitAudioContext) throw new Error('No AudioContext');
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  oscillator = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.value = 880; // A5
  oscillator.connect(gain);
  gain.connect(audioCtx.destination);
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  // fade in
  gain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.02);
  oscillator.start();

  // tremolo / efecto simple: cambiar frecuencia levemente cada 200ms
  const interval = setInterval(()=>{
    if(oscillator){
      oscillator.frequency.value = 700 + Math.random()*600;
    }
  }, 200);

  // detener después del tiempo pedido
  setTimeout(()=>{
    clearInterval(interval);
    if(gain){
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
    }
    setTimeout(()=>{
      stopSound();
    },600);
  }, durationSec * 1000);
}

// Detiene sonido y libera recursos de WebAudio
function stopSound(){
  try{
    if(oscillator){
      oscillator.stop();
      oscillator.disconnect();
      oscillator = null;
    }
    if(audioCtx){
      audioCtx.close();
      audioCtx = null;
    }
  }catch(e){
    // no hacer nada si falla
  }
}

// --- Eventos
setBtn.addEventListener('click', (e)=>{ e.preventDefault(); setAlarm(); });
clearBtn.addEventListener('click', (e)=>{ e.preventDefault(); clearAlarm(); });

// Inicializar reloj y arrancar el intervalo
tick();
setInterval(tick, 1000);

// Comentario final: El flujo principal utiliza `tick` para actualizar la UI
// y comparar la hora actual con `alarmDate`. Al dispararse la alarma se
// ejecuta `triggerAlarm` que muestra notificación, inicia sonido y
// finalmente limpia el estado llamando a `clearAlarm`.
