/* ------------ БАЗОВЫЕ ССЫЛКИ ------------- */
const track  = document.getElementById('track');
const levels = Array.from(document.querySelectorAll('.level'));

/* ------------ ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ------------- */
let curIndex = 0;
let currentIntroScreen = 1;
const totalIntroScreens = 9;

/* ------------ ФУНКЦИЯ СДВИГА ------------- */
function slideTo(idx) {
  curIndex = idx;
  const levelHeight = levels[0]?.offsetHeight || window.innerHeight;
  track.style.transform = `translate3d(0, ${-idx * levelHeight}px, 0)`;
}

/* ------------ ПУБЛИЧНАЯ НАВИГАЦИЯ ПО ID ------------- */
function goToLevel(id) {
  const k = levels.findIndex(l => l.id === id);
  if (k === -1) return;

  if (id === 'level2') loadLevel1();
  if (id === 'level3') loadLevel2();
  if (id === 'finalScreen') {
    stopTimer();
    document.getElementById('score-text').textContent = calcScore();
  }

  slideTo(k);
}

/* ===== ИНТРО-ЭКРАНЫ 1–9 ===== */
function nextIntroScreen() {
  if (currentIntroScreen < totalIntroScreens) {
    currentIntroScreen++;
    goToLevel(`introScreen${currentIntroScreen}`);
  } else {
    startTimer();
    goToLevel('level2');
  }
}
for (let i = 1; i <= totalIntroScreens; i++) {
  document.getElementById(`introScreen${i}`)
          .addEventListener('click', nextIntroScreen);
}

/* ===== ПЕРЕХОДНЫЕ ЭКРАНЫ 10–13 ===== */
document.getElementById('introScreen10')
  .addEventListener('click', () => goToLevel('level3'));
document.getElementById('introScreen11')
  .addEventListener('click', () => goToLevel('level4'));
document.getElementById('introScreen12')
  .addEventListener('click', () => goToLevel('introScreen13'));
document.getElementById('introScreen13')
  .addEventListener('click', () => goToLevel('finalScreen'));

/* ===== КНОПКИ «ОТВЕТИТЬ» ===== */
document.querySelectorAll('button[data-check]').forEach(btn => {
  btn.addEventListener('click', () => {
    const fn = btn.dataset.check;
    if (fn && typeof window[fn] === 'function') window[fn]();
  });
});

/* ===== Enter → ПОВЕРКА ===== */
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.activeElement.tagName === 'INPUT') {
    const fn = document.activeElement.dataset.check;
    if (fn && typeof window[fn] === 'function') {
      window[fn]();
      document.activeElement.blur();
    }
  }
});

/* ========== ЛОГИКА УРОВНЕЙ ========== */
/* --- Уровень 1: Фибоначчи --- */
const level1Tasks = [
  { question: "Введите 30-е число Фибоначчи:", answer: "832040" },
  { question: "Дана последовательность: 1,11,21,1211,111221,… Следующее?", answer: "13112221" },
  { question: "Треугольные числа: 1,3,6,10,15,… 6-й член?", answer: "21" }
];
let task1;
function loadLevel1() {
  task1 = level1Tasks[Math.floor(Math.random() * level1Tasks.length)];
  document.getElementById('task-question').textContent = task1.question;
  document.getElementById('fib-input').value = '';
  const fb = document.getElementById('fib-feedback');
  fb.textContent = '';
  fb.className = 'feedback';
}
function checkLevel1() {
  const val = document.getElementById('fib-input').value.trim();
  const fb  = document.getElementById('fib-feedback');
  if (val === task1.answer) {
    fb.textContent = '✅ Верно!'; fb.className = 'feedback success';
    setTimeout(() => goToLevel('introScreen10'), 800);
  } else {
    fb.textContent = '❌ Неверно!'; fb.className = 'feedback error';
  }
}

/* --- Уровень 2: ROT-13 --- */
const cipherTasks = [
  { encoded: "Y'c q juqfej",  answer: "I'm a teapot" },
  { encoded: "IjqsaEluhvbem", answer: "StackOverFlow" },
  { encoded: "Mxybu jhku",    answer: "While true" },
  { encoded: "IodjqnUhheh",   answer: "SyntaxError" }
];
let task2;
function loadLevel2() {
  task2 = cipherTasks[Math.floor(Math.random() * cipherTasks.length)];
  document.getElementById('cipher-question').textContent =
    "Зашифрованная фраза: " + task2.encoded;
  document.getElementById('cipher-input').value = '';
  const fb = document.getElementById('cipher-feedback');
  fb.textContent = '';
  fb.className = 'feedback';
}
function checkLevel2() {
  const val = document.getElementById('cipher-input').value.trim().toLowerCase();
  const fb  = document.getElementById('cipher-feedback');
  if (val === task2.answer.toLowerCase()) {
    fb.textContent = '✅ Верно!'; fb.className = 'feedback success';
    setTimeout(() => goToLevel('introScreen11'), 800);
  } else {
    fb.textContent = '❌ Неверно!'; fb.className = 'feedback error';
  }
}

/* --- Уровень 3: Исправьте код --- */
function checkLevel3() {
  const val = document.getElementById('fix-input').value.trim().replace(/\s/g, '');
  const fb  = document.getElementById('fix-feedback');
  if (val === "Array.Sort(data);".replace(/\s/g, '')) {
    fb.textContent = '✅ Верно!'; fb.className = 'feedback success';
    setTimeout(() => goToLevel('introScreen12'), 800);
  } else {
    fb.textContent = '❌ Неверно.'; fb.className = 'feedback error';
  }
}

/* ===== Таймер и подсчёт очков ===== */
let startTime, timerRef;
const timerBox = document.getElementById('timer');
function startTimer() {
  startTime = Date.now();
  timerBox.style.display = 'block';
  updateTimer();
  timerRef = setInterval(updateTimer, 1000);
}
function updateTimer() {
  const sec = Math.floor((Date.now() - startTime) / 1000);
  const mm  = String(Math.floor(sec / 60)).padStart(2, '0');
  const ss  = String(sec % 60).padStart(2, '0');
  timerBox.textContent = `${mm}:${ss}`;
}
function stopTimer() {
  clearInterval(timerRef);
  timerBox.style.display = 'none';
}
function calcScore() {
  const elapsed = (Date.now() - startTime) / 1000;
  const over    = Math.max(0, elapsed - 180);
  const penalty = Math.floor(over / 30);
  return Math.max(0, 10 - penalty);
}

/* Инициализация */
document.addEventListener('DOMContentLoaded', () => {
  loadLevel1();
  goToLevel('introScreen1');
});
