
const celebrationSound = new Audio('celebration.mp3');
function playCelebrationSound() {
  celebrationSound.play();
}


const gridSize = 7;
const words = ["GATO", "SOL", "FLOR", "NUBE", "LAGO"];
const board = document.getElementById("board");
const grid = Array.from({length: gridSize}, () => Array(gridSize).fill(""));
let foundWords = new Set();

function placeWord(word) {
  const directions = [
    [1, 0], [0, 1], [1, 1], [-1, 1]
  ];
  directions.sort(() => Math.random() - 0.5);

  for (let [dx, dy] of directions) {
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        let valid = true;
        for (let i = 0; i < word.length; i++) {
          let nx = x + dx * i;
          let ny = y + dy * i;
          if (nx < 0 || ny < 0 || nx >= gridSize || ny >= gridSize || (grid[ny][nx] !== "" && grid[ny][nx] !== word[i])) {
            valid = false;
            break;
          }
        }
        if (valid) {
          for (let i = 0; i < word.length; i++) {
            let nx = x + dx * i;
            let ny = y + dy * i;
            grid[ny][nx] = word[i];
          }
          return;
        }
      }
    }
  }
}

words.forEach(placeWord);

for (let y = 0; y < gridSize; y++) {
  for (let x = 0; x < gridSize; x++) {
    if (grid[y][x] === "") {
      grid[y][x] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    }
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.textContent = grid[y][x];
    cell.dataset.x = x;
    cell.dataset.y = y;
    board.appendChild(cell);
  }
}

let path = [];
let selecting = false;

function resetSelection() {
  path.forEach(el => el.classList.remove("selected"));
  path = [];
}

function getWordFromPath() {
  return path.map(el => el.textContent).join("");
}

function checkWord() {
  const word = getWordFromPath();
  if (words.includes(word) && !foundWords.has(word)) {
    path.forEach(el => el.classList.add("found"));
    foundWords.add(word);
    if (foundWords.size === words.length) {
      confetti(); playCelebrationSound();
    }
  }
  resetSelection();
}

// Soporte táctil
board.addEventListener("touchstart", (e) => {
  selecting = true;
  const el = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
  if (el && el.classList.contains("cell") && !el.classList.contains("found")) {
    el.classList.add("selected");
    path.push(el);
  }
});

board.addEventListener("touchmove", (e) => {
  if (!selecting) return;
  const el = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
  if (el && el.classList.contains("cell") && !el.classList.contains("found") && !path.includes(el)) {
    el.classList.add("selected");
    path.push(el);
  }
});

board.addEventListener("touchend", () => {
  selecting = false;
  checkWord();
});

// Soporte mouse
board.addEventListener("mousedown", (e) => {
  selecting = true;
});

board.addEventListener("mouseup", () => {
  selecting = false;
  checkWord();
});

board.addEventListener("mousemove", (e) => {
  if (!selecting) return;
  const el = document.elementFromPoint(e.clientX, e.clientY);
  if (el && el.classList.contains("cell") && !el.classList.contains("found") && !path.includes(el)) {
    el.classList.add("selected");
    path.push(el);
  }
});

function captureBoard() {
  html2canvas(document.querySelector("#board")).then(canvas => {
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "sopa_de_letras.png";
      a.click();
    });
  });
}

function sendToWhatsApp() {
  html2canvas(document.querySelector("#board")).then(canvas => {
    canvas.toBlob(blob => {
      const file = new File([blob], "sopa.png", { type: "image/png" });
      const reader = new FileReader();
      reader.onload = function() {
        const imageData = encodeURIComponent(reader.result);
        const phone = "56986532423";
        const url = `https://wa.me/${phone}?text=Te%20env%C3%ADo%20mi%20sopa%20de%20letras!`;
        window.open(url, '_blank');
      };
      reader.readAsDataURL(file);
    });
  });
}
