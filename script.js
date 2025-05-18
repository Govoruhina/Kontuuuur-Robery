/* ------------ ПАРАМЕТР ПЛАВНОСТИ ------------- */
const ANIM_MS = 1200;                           // мс – регулировка скорости

/* ------------ БАЗОВЫЕ ССЫЛКИ ------------- */
const track  = document.getElementById('track');        // лента
const levels = Array.from(document.querySelectorAll('.level'));

/* записываем длительность в CSS-переменную */
track.style.setProperty('--dur', ANIM_MS + 'ms');

/* ------------ ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ДЛЯ СДВИГА ------------- */
let curIndex = 0;
let currentKeyboardOffset = 0;
let currentIntroScreen = 1;
const totalIntroScreens = 9; // Total number of intro screens

/* ------------ ОСНОВНАЯ ФУНКЦИЯ ПЛАВНОГО СДВИГА ------------- */
/* ------------ ФУНКЦИЯ СДВИГА С УСЛОВИЕМ ДЛЯ PNG-ЭКРАНОВ ------------- */
function slideTo(idx, keyboardOffsetToApply = currentKeyboardOffset) {
  // Сохраняем откуда переходим
  const prevIndex = curIndex;
  const fromId = levels[prevIndex]?.id || '';
  const toId   = levels[idx]?.id   || '';

  // Если оба — introScreen, делаем мгновенный переход
  const durationMs = (fromId.startsWith('introScreen') && toId.startsWith('introScreen'))
    ? 0
    : ANIM_MS;
  track.style.setProperty('--dur', durationMs + 'ms');

  // Сдвигаем
  curIndex = idx;
  currentKeyboardOffset = keyboardOffsetToApply;
  const levelHeight = levels[0]
    ? parseFloat(getComputedStyle(levels[0]).height)
    : window.innerHeight;
  const y = -(curIndex * levelHeight) - currentKeyboardOffset;
  track.style.transform = `translate3d(0, ${y}px, 0)`;
}

/* публичная навигация по id */
function goToLevel(id){
  const k = levels.findIndex(l => l.id === id);
  if (k !== -1) {
    // If navigating to the first actual game level from the last intro screen,
    // ensure any specific intro logic is handled.
    if (id === 'level2' && levels[curIndex].id.startsWith('introScreen')) {
      // Potentially reset intro screen counter or state if needed here
    }
    slideTo(k, 0); // Explicitly set keyboard offset to 0 for new level transitions
  }
}

/* ===== НАВИГАЦИЯ ПО ИНТРО-ЭКРАНАМ ===== */
function nextIntroScreen() {
  if (currentIntroScreen < totalIntroScreens) {
    currentIntroScreen++;
    goToLevel(`introScreen${currentIntroScreen}`);
  } else {
    // Last intro screen, proceed to the first game level
    startTimer(); 
    loadLevel1(); 
    goToLevel('level2');
  }
}

// Add click listeners to intro screens
for (let i = 1; i <= totalIntroScreens; i++) {
  const introScreen = document.getElementById(`introScreen${i}`);
  if (introScreen) {
    introScreen.addEventListener('click', nextIntroScreen);
  }
}

/* ===== глобальный «Enter→проверка» ===== */
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;                // интересует только Enter
  const el = document.activeElement;            // текущий фокус
  if (el.tagName !== 'INPUT') return;           // не в поле ввода
  const fnName = el.dataset.check;              // значение data-check
  if (fnName && typeof window[fnName] === 'function'){
    window[fnName]();                           // вызываем соответствующую функцию
    el.blur();                            // убираем фокус с поля ввода
  }
});


/* ========== ЛОГИКА УРОВНЕЙ ========== */

/* --- Уровень 1: Фибоначчи (level2 → level3) --- */
const level1Tasks = [
  {
    question : "Вы подошли к дверям главного офиса Контура. \nК счастью, вам удалось ранее выведать записку-наводку для кода на входе.\nВведите 30-е число Фибоначчи:",
    answer   : "832040"
  },
  {
    question : "Вы подошли к дверям главного офиса Контура. \nК счастью, вам удалось ранее выведать записку-наводку для кода на входе.\nДана последовательность: \n1, 11, 21, 1211, 111221, 312211, …",
    answer   : "13112221"
  },
  {
    question : "Вы подошли к дверям главного офиса Контура. \nК счастью, вам удалось ранее выведать записку-наводку для кода на входе.\nТреугольные числа: 1, 3, 6, 10, 15, …\nВведите 6-й член последовательности:",
    answer   : "21"
  }
];

let task1 = null;                           // текущая задача

/* загрузить случайную задачу в level2 */
function loadLevel1(){
  task1 = level1Tasks[Math.floor(Math.random()*level1Tasks.length)];
  document.getElementById('task-question').textContent = task1.question;
  document.getElementById('fib-input').value = "";
  document.getElementById('fib-feedback').textContent = "";
  document.getElementById('fib-feedback').className  = "feedback";
}

/* --- новая проверка level1 (level2-экран) --- */
function checkLevel1(){
  document.getElementById('fib-input').blur();   // закрыть клаву
  const val = document.getElementById('fib-input').value.trim();
  const fb  = document.getElementById('fib-feedback');

  if (val === task1.answer){
    fb.textContent = "✅ Верно!";
    fb.className   = "feedback success";
    setTimeout(()=>{ 
      loadLevel2(); // Load next level's content
      goToLevel('level3'); // Then navigate
    }, 800);
  } else {
    fb.textContent = "❌ Неверно!";
    fb.className   = "feedback error";
  }
}

/* --- Уровень 2: ROT-13 (level3 → level4) --- */
const cipherTasks = [
  {encoded:"Y'c q juqfej",  answer:"I'm a teapot"},
  {encoded:"IjqsaEluhvbem", answer:"StackOverFlow"},
  {encoded:"Mxybu jhku",    answer:"While true"},
  {encoded:"IodjqnUhheh",   answer:"SyntaxError"}
];
let task2=null;

function loadLevel2(){
  task2 = cipherTasks[Math.floor(Math.random()*cipherTasks.length)];
  document.getElementById('cipher-question').textContent =
      "Теперь задача разблокировать компьютер. \nНа экране блокировки выводится фраза и непонятные буквы рядом: \nКаков ответ на главные вопросы жизни и вселенной, \nтаков и ключ для самого известного метода шифрования в 26-тибуквенном алфавите.\nЗашифрованная фраза: " + task2.encoded;
  document.getElementById('cipher-input').value = "";
  document.getElementById('cipher-feedback').textContent="";
  document.getElementById('cipher-feedback').className="feedback";
}

function checkLevel2(){
  document.getElementById('cipher-input').blur();   // закрыть клаву
  const val = document.getElementById('cipher-input').value.trim().toLowerCase();
  const ok  = task2.answer.toLowerCase();
  const fb  = document.getElementById('cipher-feedback');
  if(val === ok){
    fb.textContent = '✅ Верно!';
    fb.className   = 'feedback success';
    setTimeout(()=>goToLevel('level4'), 800);
  }else{
    fb.textContent = '❌ Неверно!';
    fb.className   = 'feedback error';
  }
}

/* --- Уровень 3: исправить код (level4 → end) --- */
function checkLevel3(){
  document.getElementById('fix-input').blur();   // закрыть клаву
  const val = document.getElementById('fix-input')
                       .value.trim().replace(/\s/g,'');
  const fb  = document.getElementById('fix-feedback');
  const ok  = "Array.Sort(data);".replace(/\s/g,'');
  if(val === ok){
  fb.textContent = '✅ Верно! Массив нужно отсортировать.';
  fb.className   = 'feedback success';

  /* — выводим баллы — */
  const score = calcScore();
  document.getElementById('score-text').textContent =
      `Твой результат: ${score} / 10 баллов (время ${Math.round((Date.now()-startTime)/1000)} с)`;

  stopTimer();
    

  setTimeout(()=>goToLevel('end'), 800);
  }else{
    fb.textContent = '❌ Неверно. Подумай над сортировкой.';
    fb.className   = 'feedback error';
  }
}

/* ---------- ОБРАБОТКА ИЗМЕНЕНИЯ РАЗМЕРА VIEWPORT (КЛАВИАТУРА) ---------- */
/* реагируем, когда высота visualViewport меняется */
if (window.visualViewport) {
  let isKeyboardConsideredOpenForScrollingPrevention = false; // Flag to track keyboard state

  window.visualViewport.addEventListener('resize', () => {
    const focusedElement = document.activeElement;
    let newCalculatedKbOffset = 0;

    // window.innerHeight represents the full height of the layout viewport
    const currentFullHeight = window.innerHeight;
    const visibleHeight = window.visualViewport.height;
    // Ensure delta is not negative (e.g. if browser UI hides, visualViewport might grow)
    const delta = Math.max(0, currentFullHeight - visibleHeight);

    isKeyboardConsideredOpenForScrollingPrevention = (delta > 150); // Heuristic for keyboard

    // Only calculate offset if an input field is focused and keyboard is considered open
    if (focusedElement && focusedElement.tagName === 'INPUT' && isKeyboardConsideredOpenForScrollingPrevention) {
      newCalculatedKbOffset = delta / 2; // Adjust view by half the keyboard/shrinkage height
    }
    // newCalculatedKbOffset remains 0 if input not focused or keyboard not significantly open,
    // or if visualViewport grew (delta would be <= 0)

    // Only update if the offset actually changes.
    // This also handles resetting to 0 when keyboard closes (delta becomes small, newCalculatedKbOffset becomes 0)
    if (newCalculatedKbOffset !== currentKeyboardOffset) {
      slideTo(curIndex, newCalculatedKbOffset);
    }
  });

  // Prevent manual touch scrolling when keyboard is considered open
  document.body.addEventListener('touchmove', (event) => {
    if (isKeyboardConsideredOpenForScrollingPrevention) {
      event.preventDefault();
    }
  }, { passive: false }); // passive: false is required for preventDefault to work

  // Add a focusout listener to help reset offset if all inputs lose focus,
  // though the resize event is the primary mechanism.
  document.addEventListener('focusout', (event) => {
    if (event.target && event.target.tagName === 'INPUT') {
      // Brief delay to check if focus moved to another input or if keyboard is truly closing.
      setTimeout(() => {
        const stillFocusedElement = document.activeElement;
        if (!(stillFocusedElement && stillFocusedElement.tagName === 'INPUT')) {
          // If no input is active, the resize event (triggered by keyboard closing
          // and visualViewport height changing) should set the offset to 0.
          // This listener is mostly a safeguard or for scenarios where resize might lag.
        }
      }, 50); // Small delay
    }
  }, true);
}

/* --- Система баллов по времени --- */
let startTime = null;   // время запуска таймера
let timerRef    = null;      // setInterval id
const timerBox  = document.getElementById('timer');


function startTimer(){
  startTime = Date.now();
  timerBox.style.display = 'block';
  updateTimer();                                // показать 00:00 → 00:01 …
  timerRef = setInterval(updateTimer, 1000);
}
function updateTimer(){
  const sec = Math.floor((Date.now() - startTime)/1000);
  const mm  = String(Math.floor(sec/60)).padStart(2,'0');
  const ss  = String(sec%60).padStart(2,'0');
  timerBox.textContent = `${mm}:${ss}`;
}

function stopTimer(){
  clearInterval(timerRef);
  timerRef = null;
  timerBox.style.display = 'none';
}


function calcScore(){
  const elapsed = (Date.now() - startTime) / 1000;     // c
  const over    = Math.max(0, elapsed - 180);          // лишнее после 3 мин
  const penalty = Math.floor(over / 30);               // каждые 30 с
  return Math.max(0, 10 - penalty);
}

// Initialize the first intro screen
document.addEventListener('DOMContentLoaded', () => {
  goToLevel('introScreen1');
  // Remove the original button's onclick from HTML if it was on level1, 
  // as intro screens now handle the start.
});

