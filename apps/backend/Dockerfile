FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g yarn
RUN npm install -g pm2

RUN yarn install

COPY . .

EXPOSE 8081

CMD ["pm2-runtime", "ecosystem.config.js"]