document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let squares = Array.from(grid.querySelectorAll("div"));
  const startBtn = document.querySelector(".button");
  const span = document.getElementsByClassName("close")[0];
  const scoreDisplay = document.querySelector(".score-display");
  const linesDisplay = document.querySelector(".lines-score");
  let currentIndex = 0;
  let currentRotation = 0;
  const width = 10;
  let score = 0;
  let lines = 0;
  let timerId;
  let nextRandom = 0;
  const colors = [
    "url(images/blue_block.png)",
    "url(images/pink_block.png)",
    "url(images/purple_block.png)",
    "url(images/peach_block.png)",
    "url(images/yellow_block.png)",
  ];

  // keycodes
  function control(e) {
    if (e.keyCode === 39) {
      moveright();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 37) {
      moveleft();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }
  document.addEventListener("keyup", control);

  // shapes
  const lShape = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const zShape = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];

  const tShape = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const oShape = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iShape = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const tetris = [lShape, zShape, tShape, oShape, iShape];

  // random shape
  let random = Math.floor(Math.random() * tetris.length);
  let current = tetris[random][currentRotation];

  // move down
  let currentPosition = 4;

  // draw
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("block");
      squares[currentPosition + index].style.backgroundImage = colors[random];
    });
  }

  // undraw
  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("block");
      squares[currentPosition + index].style.backgroundImage = "none";
    });
  }

  // move down on loop
  function moveDown() {
    undraw();
    currentPosition = currentPosition += width;
    draw();
    freeze();
  }

  startBtn.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 1000);
      nextRandom = Math.floor(Math.random() * tetris.length);
      displayShape();
    }
  });

  // move left
  function moveright() {
    undraw();
    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % width === width - 1
    );
    if (!isAtRightEdge) currentPosition += 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("block2")
      )
    ) {
      currentPosition -= 1;
    }
    draw();
  }

  // move right
  function moveleft() {
    undraw();
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );
    if (!isAtLeftEdge) currentPosition -= 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("block2")
      )
    ) {
      currentPosition += 1;
    }
    draw();
  }

  // freeze
  function freeze() {
    // if block arrives bottom / block2
    if (
      current.some(
        (index) =>
          squares[currentPosition + index + width].classList.contains(
            "block3"
          ) ||
          squares[currentPosition + index + width].classList.contains("block2")
      )
    ) {
      // block2 integration
      current.forEach((index) =>
        squares[index + currentPosition].classList.add("block2")
      );
      // new random
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * tetris.length);
      current = tetris[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }
  freeze();

  // rotate
  function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) {
      currentRotation = 0;
    }
    current = tetris[random][currentRotation];
    draw();
  }

  // gameover
  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("block2")
      )
    ) {
      scoreDisplay.innerHTML = "end";
      clearInterval(timerId);
    }
  }

  //show shape
  const displayWidth = 4;
  const displaySquares = document.querySelectorAll(".previous-grid div");
  let displayIndex = 0;

  const smallTetris = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2] /* lShape */,
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1] /* zShape */,
    [1, displayWidth, displayWidth + 1, displayWidth + 2] /* tShape */,
    [0, 1, displayWidth, displayWidth + 1] /* oShape */,
    [
      1,
      displayWidth + 1,
      displayWidth * 2 + 1,
      displayWidth * 3 + 1,
    ] /* iShape */,
  ];

  function displayShape() {
    displaySquares.forEach((square) => {
      square.classList.remove("block");
      square.style.backgroundImage = "none";
    });
    smallTetris[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add("block");
      displaySquares[displayIndex + index].style.backgroundImage =
        colors[nextRandom];
    });
  }

  // score
  function addScore() {
    for (currentIndex = 0; currentIndex < 199; currentIndex += width) {
      const row = [
        currentIndex,
        currentIndex + 1,
        currentIndex + 2,
        currentIndex + 3,
        currentIndex + 4,
        currentIndex + 5,
        currentIndex + 6,
        currentIndex + 7,
        currentIndex + 8,
        currentIndex + 9,
      ];
      if (row.every((index) => squares[index].classList.contains("block2"))) {
        score += 10;
        lines += 1;
        scoreDisplay.innerHTML = score;
        linesDisplay.innerHTML = lines;
        row.forEach((index) => {
          squares[index].style.backgroundImage = "none";
          squares[index].classList.remove("block2") ||
            squares[index].classList.remove("block");
        });
        // splice array
        const squaresRemoved = squares.splice(currentIndex, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  }
});
