# ♟️ Real-Time Multiplayer Chess Game

A real-time, two-player chess game built using **Node.js**, **Express.js**, **Template Engine (EJS)**, **Socket.IO**, and **chess.js**, packaged with **Docker** for easy deployment. Supports move synchronization, turn tracking, checkmate/stalemate detection, and responsive gameplay.

---

## 📦 Docker Image

You can pull the pre-built image directly from Docker Hub:

👉 [**harshuljain/chess-game**](https://hub.docker.com/r/harshuljain/chess-game)

```bash
docker pull harshuljain/chess-game
docker run -p 3000:3000 harshuljain/chess-game
```

## 🧩 Tech Stack

- **Node.js** – Backend runtime
- **Socket.IO** – Real-time bidirectional communication
- **Express** – Web framework
- **chess.js** – Game state management and rules
- **EJS** – Templating engine
- **HTML/CSS/JS** – Frontend interface

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Harshul02/chess-game.git
cd chess-game
```
### 2. Run Locally
```bash
npm install
node app.js
```
Then open your browser at http://localhost:3000

## 🐳 Run with Docker

### Build the image:
```bash
docker build -t chess-game .
```
### Run the container:
```bash
docker run -p 3000:3000 chess-game
```
