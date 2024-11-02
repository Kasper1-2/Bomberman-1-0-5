const grid = document.getElementById("grid");
const menu = document.getElementById("menu");
const startButton = document.getElementById("startButton");
const playerBombs = [];
let playerCount = 0;
const bombPositions = new Set();

document.getElementById("startButton").addEventListener("click", function () {
  document.querySelector(".player1-info").classList.remove("hidden");
  document.querySelector(".player2-info").classList.remove("hidden");

  document.getElementById("menu").style.display = "none";
});

let gameStartTime;
let explosionTime;

const gridWidth = 15;
const gridHeight = 15;

const countdownSound = new Audio("./Assets/Sounds/placebomb.mp3");
(countdownSound.volume = 1), 0;

const explosionSound = new Audio(
  "./Assets/Sounds/20 Second Timer Bomb Countdown With Sound-[AudioTrimmer.com].mp3"
);
explosionSound.volume = 0.8;

const gameMusic = new Audio("Assets/Sounds/soundtrackcillo.mp3");
gameMusic.volume = 0.5;
gameMusic.loop = true;

// Player data
const playerData = [
  {
    id: "player1",
    x: 1,
    y: 1,
    hasActiveBomb: false,
    bombCount: 0,
    score: 0,
    health: 3,
  },
  {
    id: "player2",
    x: gridWidth - 2,
    y: gridHeight - 2,
    hasActiveBomb: false,
    bombCount: 0,
    score: 0,
    health: 3,
  },
];

function startGame() {
  menu.style.display = "none";
  grid.style.display = "grid";
  gridLayout = generateGrid(gridWidth, gridHeight, playerData);
  createGrid();
  startGameTimer();
  gameStartTime = Date.now();
  explosionTime = Math.random() * (3000 - 1500) + 1500;
  gameMusic.play();
}
startButton.addEventListener("click", startGame);

// Initialize grid layout
let gridLayout = generateGrid(gridWidth, gridHeight, playerData);

function generateGrid(width, height, playerData) {
  const layout = [];

  const spawnLocations = playerData.map((player) => ({
    x: player.x,
    y: player.y,
  }));

  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
        row.push("O"); // Outer walls
      }
      // Check if the current cell is a spawn location
      else if (spawnLocations.some((loc) => loc.x === x && loc.y === y)) {
        row.push("F"); // Free space at spawn location
      }
      // Check if the current cell is adjacent to any player spawn location
      else if (
        spawnLocations.some((loc) => {
          return (
            (loc.x === x && loc.y === y) || // Same position
            (loc.x === x && loc.y === y - 1) || // Above
            (loc.x === x && loc.y === y + 1) || // Below
            (loc.x === x - 1 && loc.y === y) || // Left
            (loc.x === x + 1 && loc.y === y)
          ); // Right
        })
      ) {
        row.push("F"); // Free space adjacent to spawn location
      } else if (Math.random() < 0.5) {
        row.push("D");
      } else {
        row.push(Math.random() < 0.4 ? "I" : "F");
      }
    }
    layout.push(row);
  }
  return layout;
}

// Create grid
function createGrid() {
  grid.innerHTML = "";
  gridLayout.forEach((row, rowIndex) => {
    row.forEach((cellType, colIndex) => {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      switch (cellType) {
        case "O":
          cell.classList.add("outer-wall");
          break;
        case "D":
          cell.classList.add("destructible");
          break;
        case "F":
          cell.classList.add("floor");
          break;
        case "I":
          cell.classList.add("indestructible");
          break;
      }

      grid.appendChild(cell);
    });
  });

  playerData.forEach((player, index) => {
    const playerElement = document.createElement("div");
    playerElement.classList.add("player", `player${index + 1}`);
    grid.children[player.y * gridLayout[0].length + player.x].appendChild(
      playerElement
    );
  });
}

function startGameTimer() {
  const timerElement = document.getElementById("timer");

  /*
Magic Numbers:

Avoid using magic numbers (e.g., 120 for the timer, 30 for bomb placement limits). Instead, define them as constants at the top of your script with descriptive names.

If this variables are on the top of the script, it will be easier to find and modify them when needed. (also easier if you create classes for the game, and use them as properties of the class)
    */
  let timeLeft = 120;

  const timerInterval = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      alert("Game Over! Time's up!");
    } else {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      timerElement.textContent = `${minutes}:${
        seconds < 10 ? "0" + seconds : seconds
      }`;
      timeLeft--;
    }
  }, 1000);
}

// create bombs

function createBomb(playerIndex) {
  const player = playerData[playerIndex];
  const bombX = player.x;
  const bombY = player.y;

  if (["O", "D"].includes(gridLayout[bombY][bombX]) || player.hasActiveBomb) {
    console.log(`Player ${playerIndex + 1}: You can't place a bomb here!`);
    return;
  }

  const elapsedTime = (Date.now() - gameStartTime) / 1000;

  if (elapsedTime < 30 && player.bombCount >= 1) {
    console.log(
      `Player ${playerIndex + 1}: You can only place 1 bomb before 30 seconds!`
    );
    return;
  } else if (elapsedTime >= 30 && player.bombCount >= 3) {
    console.log(`Player ${playerIndex + 1}: You can only place up to 3 bombs!`);
    return;
  }

  player.hasActiveBomb = true;
  player.bombCount++;

  const bomb = document.createElement("div");
  bomb.classList.add("bomb");
  const cell = grid.children[bombY * gridLayout[0].length + bombX];
  cell.appendChild(bomb);

  gridLayout[bombY][bombX] = "B";
  playerBombs.push({ playerIndex, x: bombX, y: bombY, bomb });

  countdownSound.currentTime = 0;
  countdownSound.loop = true;
  countdownSound.play();

  let explosionTime;
  if (elapsedTime >= 60) {
    explosionTime = 1000;
  } else {
    explosionTime = Math.random() * (3000 - 1500) + 1500; // this code is repeated in line 62, consider creating a function to avoid repetition
  }

  setTimeout(() => {
    explodeBomb(playerIndex, bomb, bombX, bombY);
    countdownSound.pause();
    countdownSound.currentTime = 0;
    player.bombCount--;
    player.hasActiveBomb = false; // good job on using OOP principles here
  }, explosionTime);
}

function explodeBomb(playerIndex, bomb, x, y) {
  console.log(`Player ${playerIndex + 1}'s bomb at (${x}, ${y}) exploded!`);

  explosionSound.currentTime = 0;
  explosionSound.play();

  registerExplosionAnimation(x, y);

  const explosionRadius = document.createElement("div");
  explosionRadius.classList.add("explosion-radius");
  grid.children[y * gridLayout[0].length + x].appendChild(explosionRadius);

  setTimeout(() => {
    removeBomb(bomb);
    playerData[playerIndex].hasActiveBomb = false;

    handleExplosionEffects(x, y);
  }, 500);
}

// explosions
function registerExplosionAnimation(x, y) {
  const explosionAnimation = document.createElement("div");
  explosionAnimation.classList.add("explosion-animation");
  grid.children[y * gridLayout[0].length + x].appendChild(explosionAnimation);

  setTimeout(() => removeExplosionAnimation(explosionAnimation), 500);
}

function removeExplosionAnimation(animation) {
  if (animation && animation.parentNode) {
    animation.parentNode.removeChild(animation);
  }
}

function handleExplosionEffects(x, y) {
  const directions = [
    { x: 0, y: 0 }, // Center
    { x: 0, y: -1 }, // Up
    { x: 0, y: 1 }, // Down
    { x: -1, y: 0 }, // Left
    { x: 1, y: 0 }, // Right
  ];

  directions.forEach((direction) => {
    const targetX = x + direction.x;
    const targetY = y + direction.y;

    if (
      targetY >= 0 &&
      targetY < gridLayout.length &&
      targetX >= 0 &&
      targetX < gridLayout[0].length
    ) {
      // Handle destructible walls and player health
      if (gridLayout[targetY][targetX] === "D") {
        // Find out which player caused the explosion
        const playerIndex = playerBombs.find(
          (b) => b.x === x && b.y === y
        )?.playerIndex;
        if (playerIndex !== undefined) {
          // Increment the player's score
          playerData[playerIndex].score++;
          updateScoreDisplay(playerIndex); // Update the score display
        }

        gridLayout[targetY][targetX] = "F";
        updateGrid(targetX, targetY);
      }

      playerData.forEach((player, index) => {
        if (player.x === targetX && player.y === targetY) {
          player.health--;
          updateHeartsDisplay(index);
        }
      });

      const explosionCell = document.createElement("div");
      explosionCell.classList.add("explosion-radius");
      grid.children[targetY * gridLayout[0].length + targetX].appendChild(
        explosionCell
      );
    }
  });
}

function updateGrid(x, y) {
  const cellIndex = y * gridLayout[0].length + x; // in this case you are also handling OO principles, good job
  const cell = grid.children[cellIndex]; 
  cell.innerHTML = "";

  switch (gridLayout[y][x]) {
    case "O":
      cell.classList.add("outer-wall");
      break;
    case "D":
      cell.classList.add("destructible");
      break;
    case "F":
      cell.classList.add("floor");
      break;
    case "P":
      const playerElement = document.createElement("div");
      playerElement.classList.add("player");
      cell.appendChild(playerElement);
      break;
  }
}

// remove bomb
function removeBomb(bomb) {
  if (bomb && bomb.parentNode) {
    bomb.parentNode.removeChild(bomb);
  }
}

// hearts display
function updateHeartsDisplay(playerIndex) {
  const heartContainers = document.querySelectorAll(".hearts");
  const hearts = heartContainers[playerIndex].children;

  for (let i = 0; i < hearts.length; i++) {
    hearts[i].style.visibility =
      i < playerData[playerIndex].health ? "visible" : "hidden";
  }

  if (playerData[playerIndex].health <= 0) {
    alert(`Player ${playerIndex + 1} has lost!`);
    endGame();
  }

  const otherPlayerIndex = playerIndex === 0 ? 1 : 0;
  if (playerData[otherPlayerIndex].health <= 0) {
    alert(`Player ${otherPlayerIndex + 1} has won!`);
    endGame();
  }
}

// Player movement
function movePlayer(playerIndex, newX, newY) {
  const playerDataEntry = playerData[playerIndex];

  if (
    newY >= 0 &&
    newY < gridLayout.length &&
    newX >= 0 &&
    newX < gridLayout[0].length
  ) {
    if (gridLayout[newY][newX] === "F") {
      const playerElement = grid.querySelector(`.${playerDataEntry.id}`);
      gridLayout[playerDataEntry.y][playerDataEntry.x] = "F";
      grid.children[
        playerDataEntry.y * gridLayout[0].length + playerDataEntry.x
      ].removeChild(playerElement);

      playerDataEntry.x = newX;
      playerDataEntry.y = newY;
      gridLayout[newY][newX] = "P";
      grid.children[newY * gridLayout[0].length + newX].appendChild(
        playerElement
      );
    }
  }
}

document.addEventListener("keydown", (event) => {
  if (
    [
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "w",
      "a",
      "s",
      "d",
    ].includes(event.key)
  ) {
    event.preventDefault();
  }

  const player1 = playerData[0];
  const player2 = playerData[1];

  switch (event.key) {
    case "w":
      movePlayer(0, player1.x, player1.y - 1);
      break;
    case "s":
      movePlayer(0, player1.x, player1.y + 1);
      break;
    case "a":
      movePlayer(0, player1.x - 1, player1.y);
      break;
    case "d":
      movePlayer(0, player1.x + 1, player1.y);
      break;
    case "ArrowUp":
      movePlayer(1, player2.x, player2.y - 1);
      break;
    case "ArrowDown":
      movePlayer(1, player2.x, player2.y + 1);
      break;
    case "ArrowLeft":
      movePlayer(1, player2.x - 1, player2.y);
      break;
    case "ArrowRight":
      movePlayer(1, player2.x + 1, player2.y);
      break;

    case "b":
      createBomb(0, player1.x, player1.y);
      break;
    case "-":
      createBomb(1, player2.x, player2.y);
      break;
  }
});

function updateScoreDisplay(playerIndex) {
  const scoreElement = document.getElementById(`score${playerIndex + 1}`);
  scoreElement.textContent = playerData[playerIndex].score;
}

// End game

function endGame() {
  const player1Health = playerData[0].health;
  const player2Health = playerData[1].health;
  const player1Score = playerData[0].score;
  const player2Score = playerData[1].score;

  if (player1Health <= 0 && player2Health <= 0) {
    alert("It's a tie! Both players are out of hearts!");
  } else if (player1Health <= 0) {
    alert("Player 2 wins by default (Player 1 is eliminated)!");
  } else if (player2Health <= 0) {
    alert("Player 1 wins by default (Player 2 is eliminated)!");
  } else if (player1Health === player2Health) {
    // If both players have the same health, use score as tiebreaker
    if (player1Score > player2Score) {
      alert("Player 1 wins with a score of " + player1Score + "!");
    } else if (player2Score > player1Score) {
      alert("Player 2 wins with a score of " + player2Score + "!");
    } else {
      alert("It's a tie! Both players scored " + player1Score + "!");
    }
  } else if (player1Health > player2Health) {
    alert("Player 1 wins with " + player1Health + " hearts remaining!");
  } else {
    alert("Player 2 wins with " + player2Health + " hearts remaining!");
  }

  clearInterval(timerInterval);
  gameMusic.pause();
  menu.style.display = "block";
  grid.style.display = "none";

  resetGame();
}
