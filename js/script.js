let container = document.querySelector('.container')
let playerNameContainer = document.querySelector('.playerNameContainer')
let playerInput = document.querySelector('.playerInput')
let playerName = ''
let playerPlay = document.querySelector('.playerPlay')
let playerLabel = document.querySelector('.playerLabel')
let ship = document.querySelector('.ship')
let gameover = document.querySelector('.gameover')
let gamestart = document.querySelector('.gamestart')
let gamestop = document.querySelector('.gamestop')
let audio = document.querySelector('.audio')
let lasersound = document.querySelector('.lasersound')
let crash = document.querySelector('.crash')
let counter = document.querySelector('.counter')
let toggleMusic = document.querySelector('.toggleMusic')
let muteSpeaker = toggleMusic.querySelector('.muteSpeaker')
let musicButton = toggleMusic.querySelector('.musicButton')
let play = document.querySelector('.play')
let playButton = document.querySelector('.playButton')
let stopButton = document.querySelector('.stopButton')
let earth = document.querySelector('.earthImg')
let mars = document.querySelector('.marsImg')
let space = document.querySelector('.spaceImg')
let lives = document.querySelector('.lives')
let videoContainer = document.querySelector('.videoContainer')
let videoSource = videoContainer.querySelector('source')
let star

let asteroidElement
let asteroidShapeNumber
let asteroidShapeSize
let asteroidShape
let asteroidX
let asteroidY
let stars = 3

//Display stars
let showStars = () => {
  lives.innerHTML = ''
  while (stars > 0) {
    star = document.createElement('img')
    star.setAttribute('src', 'img/paw.png')
    star.classList.add('star')
    lives.append(star)
    stars--
  }
  stars = 3
}

let setCounter = () => {
  counter.textContent = parseInt(counter.textContent) + 1
}

//Plays laser sound
let laserSound = () => {
  lasersound.pause()
  lasersound.currentTime = 0
  lasersound.volume = 0.1
  lasersound.play()
}

//Remove laser when asteroid is hit
let removeLaser = laser => {
  if (laser && container.contains(laser)) {
    container.removeChild(laser);
  }
}


//Remove lasers when hit the bottom of the window
let removeLasers = () => {
  let oldLaser = document.querySelector('.laser')
  if (oldLaser.offsetTop <= -10) {
    container.removeChild(oldLaser)
  }
}

//Laser movement
let laserMovement = laser => {
  if (isStart) return;
  // laser.style.top = laser.offsetTop - window.innerHeight + 'px'
  laser.style.top = window.innerHeight + 'px'
  let laserInterval = setInterval(() => {
    if (
      laser.offsetTop <=
        asteroidElement.offsetTop + asteroidElement.offsetHeight - 10 &&
      laser.offsetTop >= asteroidElement.offsetTop
    ) {
      if (
        laser.offsetLeft >
          asteroidElement.offsetLeft - asteroidElement.offsetWidth / 2 &&
        laser.offsetLeft <
          asteroidElement.offsetLeft + asteroidElement.offsetWidth
      ) {
        removeLaser(laser)
        //Make asteroid smaller when hit
        if (asteroidElement.offsetWidth > 80) {
          asteroidElement.style.width = asteroidElement.offsetWidth - 40 + 'px'
          asteroidElement.style.height =
            asteroidElement.offsetHeight - 40 + 'px'
        } else {
          crash.play()
          crash.volume = 0.1
          container.removeChild(asteroidElement)
          setCounter()
          asteroidFunction()
          clearInterval(laserInterval)
        }
      }
    }
  }, 10)
}

//Create laser and initial positioning
let createLaser = () => {
  let laser = document.createElement('img')
  laser.classList.add('laser')
  laser.setAttribute('src', 'img/bullet.svg')
  container.insertAdjacentElement('beforeend', laser)
  laser.style.left = ship.offsetLeft + 45 + 'px'
  //laser.style.top = ship.offsetTop + 110 + 'px'
  laserMovement(laser)
}

//Lasershot function
let laserShot = () => {
  if (isStart) return;
  createLaser()
  removeLasers()
  laserSound()
}

//Set the asteroid position
let setAsteroidPosition = asteroid => {
  let maxWidth = container.offsetWidth - asteroid.offsetWidth
  let randomPosition = Math.floor(Math.random() * (maxWidth - 1) + 1)
  asteroid.style.left = randomPosition + 'px'
  setTimeout(() => {
    asteroid.style.bottom = window.innerHeight + 140 + 'px'
  }, 1)
}

//Set asteroid shape
let setAsteroidShape = asteroid => {
  asteroidShapeNumber = Math.floor(Math.random() * 9) + 1
  asteroidShapeSize = Math.floor(Math.random() * 16) + 4
  switch (asteroidShapeNumber) {
    case 1:
      asteroidShape = 'img/asteroid-purple.svg'
      break
    case 2:
      asteroidShape = 'img/green-asteroid.svg'
      break
    case 3:
      asteroidShape = 'img/orange-meteorite.svg'
      break
    case 4:
      asteroidShape = 'img/asteroid-black.svg'
      break
    case 5:
      asteroidShape = 'img/rock.svg'
      break
    case 6:
      asteroidShape = 'img/meteorite-white.svg'
      break
    case 7:
      asteroidShape = 'img/lightorange-asteroid.svg'
      break
    case 8:
      asteroidShape = 'img/rocky-asteroid.svg'
      break
    case 9:
      asteroidShape = 'img/purple-asteroid.svg'
      break
    default:
      break
  }
  asteroid.setAttribute('src', asteroidShape)
  asteroid.style.height = `${asteroidShapeSize}rem`
  asteroid.style.width = `${asteroidShapeSize}rem`
}

//Gameover Popup
let gameoverFunc = () => {
  gameover.style.display = 'flex';
  stopGame();
  play.addEventListener('click', e => {
    location.reload()
  })
}

let gameRunning = true;

//Stops game
let stopGame = () => {
  removeEventListeners();
  laserShot = 'none';
  gameRunning = false;
  ship.style.display = 'none';

}

let isPaused = false; // Флаг паузы
let asteroidTimers = []; // Массив для хранения таймеров астероидов
let isStart = true
ship.style.display = 'none'; 

let startGame = () => {
  isStart = !isStart;
  if (!isStart) {
    asteroidFunction();
    gamestart.style.display = 'none';
    addEventListeners();
    ship.style.display = 'block';
  }
}

playButton.addEventListener('click', e => {
  startGame();
});

// Функция для установки паузы
let togglePause = () => {
  isPaused = !isPaused; // Переключаем состояние паузы 
  if (isPaused) {
    // Останавливаем игру
    gamestop.style.display = 'flex';
    removeEventListeners();
    ship.style.display = 'none';  
  } else {
    // Возобновляем игру
    if (!checkAsteroids()) {
      asteroidFunction();  // Запускаем создание астероидов, если их нет на экране
    }
    gamestop.style.display = 'none';
    addEventListeners();
    ship.style.display = 'block';
  }
}

// Обработчик нажатия клавиши Escape
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    togglePause();
  }
});

// Обработчик нажатия кнопки Play
stopButton.addEventListener('click', () => {
  togglePause();
});

//Removes stars
let removeStars = () => {
  if (stars > 1) {
    lives.removeChild(star);
    stars--;
    console.log(stars);
  } else if (stars === 1) {
    console.log('egual 1');
    lives.removeChild(star);
    stars--;
    gameoverFunc();
  }
};

// Остановка всех таймеров
let clearAllTimers = () => {
  for (let i = 0; i < asteroidTimers.length; i++) {
    clearTimeout(asteroidTimers[i]);
  }
  asteroidTimers = [];
};

let timeoutFunc = asteroid => {
  let asteroidPosition = asteroid.offsetTop;
  if (isPaused) {
    if (container.contains(asteroid)) {
      container.removeChild(asteroid);
  }}
  if (asteroidPosition <= -80) {
    if (container.contains(asteroid)) {
      container.removeChild(asteroid);
      star = document.querySelector('.star');
      removeStars();

      if (gameRunning && !isPaused && !isStart) {
        asteroidFunction(); // Создаем новый астероид только если игра идет и нет паузы
      };
    };
  } else {
    setTimeout(() => timeoutFunc(asteroid), 1000);
  }
};

let checkAsteroids = () => {
  // Получаем все элементы, которые являются астероидами
  let asteroids = document.querySelectorAll('.asteroid');
  return asteroids.length > 0;
};

// Remove asteroid
let removeAsteroid = asteroid => {
  setTimeout(() => timeoutFunc(asteroid), 3000);
};

//Create asteroid
let createAsteroid = () => {
  asteroidElement = document.createElement('img');
  asteroidElement.classList.add('asteroid');
  asteroidElement.setAttribute('draggable', 'false');
  return asteroidElement;
};

//Full asteroid functionality
let asteroidFunction = () => {
  if (!gameRunning || isPaused || isStart) return;

  let asteroid = createAsteroid();
  container.append(asteroid);
  setAsteroidShape(asteroid);
  setAsteroidPosition(asteroid);
  timeoutFunc(asteroid);
};

showStars()
let nameStorage = localStorage.getItem('name')
console.log(nameStorage)
if (nameStorage) {
  playerLabel.textContent = nameStorage
  asteroidFunction()
  document.addEventListener('click', laserShot);
  }
 else {
  playerNameContainer.style.display = 'flex'
  playerPlay.addEventListener('click', () => {
    playerName = playerInput.value
    if (playerName) {
      localStorage.setItem('name', playerName)
      playerLabel.textContent = playerName
      playerNameContainer.style.display = 'none';
      asteroidFunction();
      //Mouse laser shot event listener
      document.addEventListener('click', laserShot);
    };
  }
)};

//Music playback start after 3 seconds
let musicPlay = setTimeout(() => {
  audio.play()
  audio.volume = 0.1;
}, 4000);

//Toggle music
toggleMusic.addEventListener('click', () => {
  if (audio.paused) {
    muteSpeaker.style.opacity = '0';
    return audio.play();
  };
  audio.pause();
  audio.currentTime = 0;
  muteSpeaker.style.opacity = '1';
});

const shipSpeed = 40;  // Скорость перемещения корабля
const containerWidth = container.offsetWidth;  // Ширина игрового контейнера
const shipWidth = ship.offsetWidth;  // Ширина корабля

// Обработчик нажатия клавиш
let handleKeydown = ('keydown', event => {
  if (event.code === 'KeyA' || event.key === 'ArrowLeft') { // Нажатие клавиши "A"
    moveShipLeft();
  }
  if (event.code === 'KeyD' || event.key === 'ArrowRight') { // Нажатие клавиши "D"
    moveShipRight();
  }
  if (event.code === 'Space') { // Проверяем, была ли нажата клавиша пробела (код 32 для пробела)
    event.preventDefault();  // Предотвращаем прокрутку страницы при нажатии пробела
    createLaser();  // Запускаем выстрел лазера
  }
});

// Функция перемещения корабля влево
let moveShipLeft = () => {
  let currentLeft = ship.offsetLeft;
  if (currentLeft > 0) { // Проверяем, что корабль не выходит за левую границу
    ship.style.left = (currentLeft - shipSpeed) + 'px';  // Перемещаем корабль влево
}};
  
// Функция перемещения корабля вправо
let moveShipRight = () => {
  let currentLeft = ship.offsetLeft;
  if (currentLeft < containerWidth - shipWidth) { // Проверяем, что корабль не выходит за правую границу
    ship.style.left = (currentLeft + shipSpeed) + 'px';  // Перемещаем корабль вправо
  }
};

//Mouse ship movement
let handleMousemove = (event) => {
  ship.style.left = event.clientX - 60 + 'px'
};

//Touch ship movement
let handleTouchmove = (event) => {
  if (Math.floor(event.touches[0].clientX) > window.innerWidth * 0.7) {
  } else {
    ship.style.left = Math.floor(event.touches[0].clientX) + 'px';
}};

let addEventListeners = () => {
  document.addEventListener('click', laserShot);
  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('mousemove', handleMousemove);
  document.addEventListener('touchmove', handleTouchmove);
  
};

addEventListeners();

let removeEventListeners = () => {
  document.removeEventListener('click', laserShot);
  document.removeEventListener('keydown', handleKeydown);
  document.removeEventListener('mousemove', handleMousemove);
  document.removeEventListener('touchmove', handleTouchmove);
  
};

//Earth background
earth.addEventListener('click', () => {
  videoSource.setAttribute('src', 'video/earth.mp4');
  videoContainer.load();
});

//Mars background
mars.addEventListener('click', () => {
  videoSource.setAttribute('src', 'video/mars.mp4');
  videoContainer.load();
});

//Space background
space.addEventListener('click', () => {
  videoSource.setAttribute('src', 'video/galaxy.mp4');
  videoContainer.load();
});

