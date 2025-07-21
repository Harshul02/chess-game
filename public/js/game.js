const socket = io();
const chess = new Chess();
const boardElement = document.querySelector(".chessboard");
const notification = document.getElementById("notification");
const turnText = document.getElementById("turn-text");

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;
let gameOverState = false;

const renderBoard = () => {
  const board = chess.board();
  boardElement.innerHTML = "";
  board.forEach((row, rowIndex) => {
    row.forEach((square, squareIndex) => {
      const squareElement = document.createElement("div");
      squareElement.classList.add(
        "square",
        (rowIndex + squareIndex) % 2 === 0 ? "light" : "dark"
      );

      squareElement.dataset.row = rowIndex;
      squareElement.dataset.col = squareIndex;

      if (square) {
        const pieceElement = document.createElement("div");
        pieceElement.classList.add(
          "piece",
          square.color === "w" ? "white" : "black"
        );

        pieceElement.innerText = getPieceUnicode(square);
        pieceElement.draggable = playerRole === square.color;

        pieceElement.addEventListener("dragstart", (e) => {
          if (pieceElement.draggable) {
            draggedPiece = pieceElement;
            sourceSquare = { row: rowIndex, col: squareIndex };
            e.dataTransfer.setData("text/plain", "");
          }
        });

        pieceElement.addEventListener("dragend", (e) => {
          draggedPiece = null;
          sourceSquare = null;
        });

        squareElement.appendChild(pieceElement);
      }

      squareElement.addEventListener("dragover", (e) => {
        e.preventDefault();
      });

      squareElement.addEventListener("drop", (e) => {
        e.preventDefault();
        if (draggedPiece) {
          const targetSource = {
            row: parseInt(squareElement.dataset.row),
            col: parseInt(squareElement.dataset.col),
          };
          handleMove(sourceSquare, targetSource);
        }
      });
      boardElement.appendChild(squareElement);
    });
  });

  if (playerRole === "b") {
    boardElement.classList.add("flipped");
  } else {
    boardElement.classList.remove("flipped");
  }

  if (!gameOverState) {
    const turn = chess.turn() === "w" ? "White" : "Black";

    if (playerRole === null) {
      turnText.innerText = `You're Spectating • Turn: ${turn}`;
      turnText.className =
        "inline-block px-4 py-4 rounded text-lg font-semibold text-white bg-gray-500";
    } else if (playerRole === chess.turn()) {
      turnText.innerText = `Your Turn (${turn})`;
      turnText.className =
        "inline-block px-4 py-4 rounded text-lg font-semibold text-white bg-green-600";
    } else {
      turnText.innerText = `Opponent's Turn (${turn})`;
      turnText.className =
        "inline-block px-4 py-4 rounded text-lg font-semibold text-white bg-yellow-600";
    }
  }
};

const handleMove = (source, target) => {
  const move = {
    from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
    to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
    promotion: "q",
  };
  socket.emit("move", move);
};

const getPieceUnicode = (piece) => {
  const unicodePieces = {
    p: "♙",
    r: "♖",
    n: "♘",
    b: "♗",
    q: "♕",
    k: "♔",
    P: "♟",
    R: "♜",
    N: "♞",
    B: "♝",
    Q: "♛",
    K: "♚",
  };
  return unicodePieces[piece.type] || "";
};

const showNotification = (message) => {
  notification.innerText = message;
  notification.style.display = "block";
  setTimeout(() => {
    notification.style.display = "none";
  }, 2000);
};

socket.on("playerRole", (role) => {
  playerRole = role;
  renderBoard();
});

socket.on("spectatorRole", () => {
  playerRole = null;
  renderBoard();
});

socket.on("boardState", (fen) => {
  chess.load(fen);
  renderBoard();
});
socket.on("move", (move) => {
  chess.move(move);
  renderBoard();
});

socket.on("invalidMove", (move) => {
  showNotification("Invalid move!");
});

socket.on("gameOver", (data) => {
  gameOverState = true;
  turnText.innerText = data.message;
  turnText.className =
    "inline-block px-4 py-4 rounded text-lg font-semibold text-white bg-gray-500";
});
