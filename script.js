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

function unlockNext(currentLevel) {
  const nextId = currentLevel === 3 ? 'end' : `level${currentLevel + 1}`;
  const nextLevel = document.getElementById(nextId);
  if (nextLevel) {
    nextLevel.classList.remove('locked');
    const offsetTop = nextLevel.offsetTop;
    smoothScrollTo(offsetTop, scrollDuration); // плавный скролл
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
