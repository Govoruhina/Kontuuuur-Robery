/* === Параметры === */
const ANIM_MS = 1200; // плавность перехода
let curIndex = 0; // текущий экран
let keyboardOffset = 0; // смещение клавы
let startTime = null;
let timerRef = null;

/* === Элементы === */
const track = document.getElementById("track");
const levels = Array.from(document.querySelectorAll(".level"));
const timerBox = document.getElementById("timer");
track.style.setProperty("--dur", ANIM_MS + "ms");

/* === Навигация === */
function applyTransform() {
  const baseY = -curIndex * window.innerHeight;
  track.style.transform = `translate3d(0, ${baseY - keyboardOffset}px, 0)`;
}

function goToLevel(id) {
  const idx = levels.findIndex((el) => el.id === id);
  if (idx !== -1) {
    curIndex = idx;
    applyTransform();
  }
}

/* === Visual Viewport — клавиатура === */
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", () => {
    const delta = window.innerHeight - window.visualViewport.height;
    keyboardOffset = delta > 150 ? delta / 2 : 0;
    applyTransform();
  });
}

/* === Таймер === */
function startTimer() {
  startTime = Date.now();
  timerBox.style.display = "block";
  updateTimer();
  timerRef = setInterval(updateTimer, 1000);
}
function stopTimer() {
  clearInterval(timerRef);
  timerRef = null;
  timerBox.style.display = "none";
}
function updateTimer() {
  const sec = Math.floor((Date.now() - startTime) / 1000);
  const mm = String(Math.floor(sec / 60)).padStart(2, "0");
  const ss = String(sec % 60).padStart(2, "0");
  timerBox.textContent = `${mm}:${ss}`;
}

/* === Расчёт баллов === */
function calcScore() {
  const elapsed = (Date.now() - startTime) / 1000;
  const over = Math.max(0, elapsed - 240);
  const penalty = Math.floor(over / 30);
  return Math.max(0, 10 - penalty);
}

/* === Уровень 1 === */
const level1Tasks = [
  {
    question: "Введите 30-е число Фибоначчи:",
    answer: "832040",
  },
  {
    question:
      "Последовательность: 1, 11, 21, 1211, 111221, 312211, …\nКакое число идёт следующим?",
    answer: "13112221",
  },
  {
    question:
      "Треугольные числа: 1, 3, 6, 10, 15, …\nВведите 6-й член последовательности:",
    answer: "21",
  },
];
let task1 = null;

function loadLevel1() {
  task1 =
    level1Tasks[Math.floor(Math.random() * level1Tasks.length)];
  document.getElementById("task-question").textContent = task1.question;
  document.getElementById("fib-input").value = "";
  document.getElementById("fib-feedback").textContent = "";
  document.getElementById("fib-feedback").className = "feedback";
}

function checkLevel1() {
  const input = document.getElementById("fib-input");
  input.blur();
  const val = input.value.trim();
  const fb = document.getElementById("fib-feedback");

  if (val === task1.answer) {
    fb.textContent = "✅ Верно!";
    fb.className = "feedback success";
    setTimeout(() => {
      loadLevel2();
      goToLevel("level3");
    }, 800);
  } else {
    fb.textContent = "❌ Неверно!";
    fb.className = "feedback error";
  }
}

/* === Уровень 2 === */
const cipherTasks = [
  { encoded: "Y'c q juqfej", answer: "I'm a teapot" },
  { encoded: "IjqsaEluhvbem", answer: "StackOverFlow" },
  { encoded: "Mxybu jhku", answer: "While true" },
  { encoded: "IodjqnUhheh", answer: "SyntaxError" },
];
let task2 = null;

function loadLevel2() {
  task2 = cipherTasks[Math.floor(Math.random() * cipherTasks.length)];
  document.getElementById("cipher-question").textContent =
    "Расшифруй: " + task2.encoded;
  document.getElementById("cipher-input").value = "";
  document.getElementById("cipher-feedback").textContent = "";
  document.getElementById("cipher-feedback").className = "feedback";
}

function checkLevel2() {
  const input = document.getElementById("cipher-input");
  input.blur();
  const val = input.value.trim().toLowerCase();
  const fb = document.getElementById("cipher-feedback");
  const ok = task2.answer.toLowerCase();

  if (val === ok) {
    fb.textContent = "✅ Верно!";
    fb.className = "feedback success";
    setTimeout(() => goToLevel("level4"), 800);
  } else {
    fb.textContent = "❌ Неверно!";
    fb.className = "feedback error";
  }
}

/* === Уровень 3 === */
function checkLevel3() {
  const input = document.getElementById("fix-input");
  input.blur();
  const val = input.value.trim().replace(/\s/g, "");
  const fb = document.getElementById("fix-feedback");
  const correct = "Array.Sort(data);".replace(/\s/g, "");

  if (val === correct) {
    fb.textContent =
      "✅ Верно! Массив нужно отсортировать.";
    fb.className = "feedback success";

    const score = calcScore();
    document.getElementById("score-text").textContent =
      `Твой результат: ${score} / 10 баллов (время ${Math.round((Date.now()-startTime)/1000)} с)`;

    stopTimer();
    setTimeout(() => goToLevel("end"), 800);
  } else {
    fb.textContent =
      "❌ Неверно. Подумай над сортировкой.";
    fb.className = "feedback error";
  }
}

/* === Обработка Enter в input === */
/*
document.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  const el = document.activeElement;
  if (el.tagName !== "INPUT") return;
  const fn = el.dataset.check;
  if (fn && typeof window[fn] === "function") {
    el.blur();
    window[fn]();
  }
});
*/

/* === Инициализация === */
applyTransform();
