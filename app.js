const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const { Chess } = require("chess.js");
const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
const chess = new Chess();
let players = {};
let currentPlayer = "w";

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/health", (req, res) => {
  return res.status(200).json({ status: "Healthy" });
});
io.on("connection", (socket) => {
  console.log("Connected");

  if (!players.white) {
    players.white = socket.id;
    socket.emit("playerRole", "w");
  } else if (!players.black) {
    players.black = socket.id;
    socket.emit("playerRole", "b");
  } else {
    socket.emit("spectatorRole");
  }

  socket.emit("boardState", chess.fen());

  socket.on("disconnect", () => {
    if (socket.id === players.white) {
      delete players.white;
    } else if (socket.id === players.black) {
      delete players.black;
    }
  });

  socket.on("move", (move) => {
    try {
      if (chess.turn() === "w" && socket.id !== players.white) return;
      if (chess.turn() === "b" && socket.id !== players.black) return;

      const result = chess.move(move);

      if (result) {
        currentPlayer = chess.turn();
        io.emit("move", move);
        io.emit("boardState", chess.fen());

        if (chess.isCheckmate()) {
            const winner = chess.turn() === "w" ? "Black" : "White";
            io.emit("gameOver", {
                result: "checkmate",
                message: `Checkmate! ${winner} wins.`,
            });
            console.log("check mate");
        } else if (chess.isStalemate()) {
          console.log("stalemate");
          io.emit("gameOver", {
            result: "stalemate",
            message: "Stalemate! It's a draw.",
          });
        } else if (chess.isDraw()) {
          console.log("Draw");
          io.emit("gameOver", {
            result: "draw",
            message: "Draw! Game ends in a draw.",
          });
        }
      } else {
        socket.emit("invalidMove", move);
      }
    } catch (error) {
      socket.emit("invalidMove", move);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
