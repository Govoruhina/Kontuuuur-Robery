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

/* ========== ЛОГИКА УРОВНЕЙ ========== */

/* --- Уровень 1: Фибоначчи (level2 → level3) --- */
function checkLevel1(){
  const val = document.getElementById('fib-input').value.trim();
  const fb  = document.getElementById('fib-feedback');
  if(val === "832040"){
    fb.textContent = '✅ Верно!';
    fb.className   = 'feedback success';
    setTimeout(()=>{ goToLevel('level3'); loadLevel2(); }, 800);
  }else{
    fb.textContent = '❌ Неверно!';
    fb.className   = 'feedback error';
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
  const val = document.getElementById('fix-input')
                       .value.trim().replace(/\s/g,'');
  const fb  = document.getElementById('fix-feedback');
  const ok  = "Array.Sort(data);".replace(/\s/g,'');
  if(val === ok){
    fb.textContent = '✅ Верно! Массив нужно отсортировать.';
    fb.className   = 'feedback success';
    setTimeout(()=>goToLevel('end'), 800);
  }else{
    fb.textContent = '❌ Неверно. Подумай над сортировкой.';
    fb.className   = 'feedback error';
  }
}
