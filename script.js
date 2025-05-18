/* ------------ ПАРАМЕТР ПЛАВНОСТИ ------------- */
const ANIM_MS = 1200;                           // мс – регулировка скорости

/* ------------ БАЗОВЫЕ ССЫЛКИ ------------- */
const track  = document.getElementById('track');        // лента
const levels = Array.from(document.querySelectorAll('.level'));

/* записываем длительность в CSS-переменную */
track.style.setProperty('--dur', ANIM_MS + 'ms');

/* ------------ ПЛАВНЫЙ СДВИГ ------------- */
function slideTo(idx){
  const y = -idx * window.innerHeight;                  // px, не vh
  track.style.transform = `translate3d(0, ${y}px, 0)`;  // GPU-анимация
}

/* публичная навигация по id */
function goToLevel(id){
  const k = levels.findIndex(l => l.id === id);
  if (k !== -1) slideTo(k);
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
    question : "Введите 30-е число Фибоначчи:",
    answer   : "832040"
  },
  {
    question : "Последовательность: 1, 11, 21, 1211, 111221, 312211, …\nКакое число идёт следующим?",
    answer   : "13112221"
  },
  {
    question : "Треугольные числа: 1, 3, 6, 10, 15, …\nВведите 6-й член последовательности:",
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
    setTimeout(()=>{ goToLevel('level3'); loadLevel2(); }, 800);
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
      "Расшифруй: " + task2.encoded;
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

/* ---------- сдвиг при появлении клавиатуры ---------- */
let curIndex = 0;                          // актуальный экран
function slideTo(idx){
  curIndex = idx;                          // <- сохраняем
  const y = -idx * window.innerHeight;
  track.style.transform = `translate3d(0, ${y}px, 0)`;
}

/* реагируем, когда высота visualViewport меняется */
if (window.visualViewport){
  let kbOffset = 0;
  window.visualViewport.addEventListener('resize', () => {
    const delta = window.innerHeight - window.visualViewport.height;

    /* если delta >~150-200 px – клавиатура точно открыта */
    const needShift = delta > 150 ? delta/2 : 0;   // поднимаем примерно на половину клавы

    if (needShift !== kbOffset){
      kbOffset = needShift;
      const y = -(curIndex * window.innerHeight) - kbOffset;
      track.style.transform = `translate3d(0, ${y}px, 0)`;
    }
  });
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

