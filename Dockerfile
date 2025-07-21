FROM node:20-alpine

WORKDIR /chess-game

COPY package*.json ./

RUN npm install

COPY . .

ENTRYPOINT [ "node", "app.js" ]