FROM node:latest

WORKDIR /app

COPY packge*.json ./

RUN npm install

COPY .  .

EXPOSE 3000
CMD [ "node","server.js"]
