// script.js - Lógica modular de la calculadora
// Separación: funciones de cálculo (logic) y control del DOM (ui)

const MAX_VISIBLE = 12; // dígitos visibles aproximados en pantalla

// Estado de la calculadora
const state = {
  current: '0',
  previous: null,
  operator: null,
  waitingForNew: false,
  lastOperation: ''
};

// ---------- LÓGICA (sin DOM) ----------
function sanitizeNumberString(s){
  // elimina ceros iniciales salvo "0." y evita cadenas vacías
  if(!s) return '0';
  if(s === '.') return '0.';
  if(s.startsWith('0') && !s.startsWith('0.')){
    // eliminar ceros delante
    s = s.replace(/^0+(?!$)/, '');
  }
  return s;
}

function calculate(a, b, op){
  const x = Number(a);
  const y = Number(b);
  if(Number.isNaN(x) || Number.isNaN(y)) return null;
  switch(op){
    case '+': return x + y;
    case '-': return x - y;
    case '*': return x * y;
    case '/': return (y === 0) ? null : x / y;
    default: return null;
  }
}

function toPercent(val){
  const n = Number(val);
  if(Number.isNaN(n)) return '0';
  return String(n / 100);
}

function formatNumberDisplay(value){
  if(value === 'Error') return 'Error';
  let num = Number(value);
  if(!isFinite(num)) return 'Error';
  // límite de dígitos: usar notación científica si es muy grande/pequeño
  const abs = Math.abs(num);
  if(abs >= 1e12 || (abs > 0 && abs < 1e-8)){
    return num.toExponential(6).replace(/e\+?/, 'e');
  }
  // mostrar con máximo MAX_VISIBLE dígitos significativos sin perder decimales
  const intPart = Math.trunc(abs).toString().length + (num < 0 ? 1 : 0);
  if(intPart > MAX_VISIBLE){
    return num.toExponential(6).replace(/e\+?/, 'e');
  }
  const maxDecimals = Math.max(0, MAX_VISIBLE - intPart);
  // evitar notación exponencial en la mayoría de casos
  return Number(num.toFixed(maxDecimals)).toString();
}

// ---------- DOM / UI ----------
const outputEl = document.getElementById('output');
const historyEl = document.getElementById('history');
const keys = document.querySelector('.keys');

function updateDisplay(){
  outputEl.textContent = formatNumberDisplay(state.current);
  historyEl.textContent = state.lastOperation || '\u00A0';
}

function clearAll(){
  state.current = '0';
  state.previous = null;
  state.operator = null;
  state.waitingForNew = false;
  state.lastOperation = '';
  updateDisplay();
}

function backspace(){
  if(state.waitingForNew){
    state.current = '0';
    state.waitingForNew = false;
    updateDisplay();
    return;
  }
  if(state.current.length <= 1){
    state.current = '0';
  } else {
    state.current = state.current.slice(0, -1);
  }
  updateDisplay();
}

function inputDigit(digit){
  if(state.waitingForNew){
    state.current = (digit === '.') ? '0.' : digit;
    state.waitingForNew = false;
    updateDisplay();
    return;
  }
  if(digit === '.' && state.current.includes('.')) return;
  if(state.current === '0' && digit !== '.'){
    state.current = digit;
  } else {
    // prevenir demasiados caracteres
    if(state.current.replace('-', '').replace('.', '').length >= 18) return;
    state.current += digit;
  }
  state.current = sanitizeNumberString(state.current);
  updateDisplay();
}

function handleOperator(op){
  if(state.operator && !state.waitingForNew){
    // realizar cálculo previo
    const result = calculate(state.previous, state.current, state.operator);
    if(result === null || !isFinite(result)){
      state.current = 'Error';
      state.previous = null; state.operator = null; state.waitingForNew = true;
      state.lastOperation = '';
      updateDisplay();
      return;
    }
    state.current = String(result);
    state.previous = state.current;
  } else {
    state.previous = state.current;
  }
  state.operator = op;
  state.waitingForNew = true;
  updateDisplay();
}

function computeEquals(){
  if(!state.operator || state.previous === null){
    // nothing to compute
    state.lastOperation = '';
    updateDisplay();
    return;
  }
  const result = calculate(state.previous, state.current, state.operator);
  if(result === null || !isFinite(result)){
    state.current = 'Error';
    state.previous = null; state.operator = null; state.waitingForNew = true;
    state.lastOperation = '';
    updateDisplay();
    return;
  }
  // registrar historial simple: "5 + 3 = 8"
  state.lastOperation = `${formatNumberDisplay(state.previous)} ${state.operator} ${formatNumberDisplay(state.current)} = ${formatNumberDisplay(String(result))}`;
  state.current = String(result);
  state.previous = null;
  state.operator = null;
  state.waitingForNew = true;
  updateDisplay();
}

function toggleSign(){
  if(state.current === '0') return;
  if(state.current.startsWith('-')) state.current = state.current.slice(1);
  else state.current = '-' + state.current;
  updateDisplay();
}

function applyPercent(){
  // Convierte el valor actual en porcentaje (divide por 100)
  state.current = toPercent(state.current);
  updateDisplay();
}

// ---------- Eventos y manejo UI ----------
keys.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if(!btn) return;
  const action = btn.dataset.action;
  if(btn.classList.contains('num')){
    inputDigit(btn.dataset.digit);
    return;
  }
  switch(action){
    case 'clear': clearAll(); break;
    case 'backspace': backspace(); break;
    case 'percent': applyPercent(); break;
    case 'neg': toggleSign(); break;
    case 'operator': handleOperator(btn.dataset.op); break;
    case 'equals': computeEquals(); break;
  }
});

// Teclado: números, punto, Enter, Backspace, operadores + - * / %
window.addEventListener('keydown', (e) => {
  if(e.repeat) return;
  const key = e.key;
  if((/^[0-9]$/).test(key)){
    inputDigit(key);
    e.preventDefault();
    return;
  }
  if(key === '.'){
    inputDigit('.'); e.preventDefault(); return;
  }
  if(key === 'Enter' || key === '='){
    computeEquals(); e.preventDefault(); return;
  }
  if(key === 'Backspace'){
    backspace(); e.preventDefault(); return;
  }
  if(key === 'Escape'){
    clearAll(); e.preventDefault(); return;
  }
  if(['+','-','*','/'].includes(key)){
    handleOperator(key); e.preventDefault(); return;
  }
  if(key === '%'){
    applyPercent(); e.preventDefault(); return;
  }
});

// Inicializar
clearAll();

// Exportado para pruebas manuales desde consola si se desea
