const scrollDuration = 1000; // регулировка скрола

function smoothScrollTo(targetY, duration) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  function scrollStep(currentTime) {
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = easeInOutCubic(progress);
    window.scrollTo(0, startY + distance * ease);

    if (progress < 1) {
      requestAnimationFrame(scrollStep);
    }
  }

  requestAnimationFrame(scrollStep);
}

function easeInOutCubic(t) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function startGame() { // старт игры
  const intro = document.getElementById('intro');
  intro.style.display = 'none';

  const level1 = document.getElementById('level1');
  level1.classList.remove('locked'); // разблокируем уровень 1
  level1.scrollIntoView({ behavior: 'smooth' });
}

function checkLevel1() {
  const input = document.getElementById('fib-input').value.trim();
  const feedback = document.getElementById('fib-feedback');

  if (input === "832040") {
    feedback.textContent = "✅ Правильно! Доступ получен.";
    feedback.classList.remove("error");
    feedback.classList.add("success");

    setTimeout(() => {
      unlockNext(1);
    }, 1000);
  } else {
    feedback.textContent = "❌ Неправильно. Попробуй ещё раз.";
    feedback.classList.remove("success");
    feedback.classList.add("error");
  }
}


const cipherTasks = [
  {
    encoded: "Y'c q juqfej",
    answer: "I'm a teapot"
  },
  {
    encoded: "IjqsaEluhvbem",
    answer: "StackOverFlow"
  },
  {
    encoded: "Mxybu jhku",
    answer: "While true"
  },
  {
    encoded: "IodjqnUhheh",
    answer: "SyntaxError"
  }
];

let selectedTask2 = null;

function loadLevel2() {
  selectedTask2 = cipherTasks[Math.floor(Math.random() * cipherTasks.length)];
  document.getElementById("cipher-question").textContent =
    "Расшифруй: " + selectedTask2.encoded;
  document.getElementById("cipher-feedback").textContent = "";
  document.getElementById("cipher-feedback").className = "feedback";
  document.getElementById("cipher-input").value = "";
}

function checkLevel2() {
  const input = document.getElementById('cipher-input').value.trim();
  const feedback = document.getElementById('cipher-feedback');
  const correct = selectedTask2.answer.toLowerCase();

  if (input.toLowerCase() === correct) {
    feedback.textContent = "✅ Верно! Уровень пройден.";
    feedback.classList.remove("error");
    feedback.classList.add("success");
    setTimeout(() => {
      unlockNext(2);
    }, 1000);
  } else {
    feedback.textContent = "❌ Неверно. Попробуй ещё.";
    feedback.classList.remove("success");
    feedback.classList.add("error");
  }
}

function checkLevel3() {
  const input = document.getElementById('fix-input').value.trim();
  const feedback = document.getElementById('fix-feedback');

  const correct = "Array.Sort(data);";

  if (input.replace(/\s/g, "") === correct.replace(/\s/g, "")) {
    feedback.textContent = "✅ Верно! Массив нужно отсортировать перед бинарным поиском.";
    feedback.classList.remove("error");
    feedback.classList.add("success");
    setTimeout(() => {
      unlockNext(3);
    }, 1000);
  } else {
    feedback.textContent = "❌ Неверно. Подумай, что нужно сделать с массивом.";
    feedback.classList.remove("success");
    feedback.classList.add("error");
  }
}


function unlockNext(currentLevel) {
  const nextId = currentLevel === 3 ? 'end' : `level${currentLevel + 1}`;
  const nextLevel = document.getElementById(nextId);
  if (nextLevel) {
    nextLevel.classList.remove('locked');

    // Загрузка задания уровня 2
    if (currentLevel === 1) loadLevel2();

    const offsetTop = nextLevel.offsetTop;
    smoothScrollTo(offsetTop, scrollDuration);
  }
}


function restartGame() {
  const intro = document.getElementById('intro');
  intro.style.display = 'block';

  const levels = document.querySelectorAll('section');
  levels.forEach(level => {
    if (level.id !== 'intro') level.classList.add('locked');
  });

  document.getElementById('level1').classList.remove('locked');

  // Принудительно обновляем layout
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, 50);
}



document.addEventListener('wheel', function (e) {
  const levels = Array.from(document.querySelectorAll('section'));
  for (let i = 1; i < levels.length; i++) {
    if (levels[i].classList.contains('locked')) {
      e.preventDefault();
      return;
    }
  }
}, { passive: false });
