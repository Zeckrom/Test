FROM node:10
EXPOSE 3000
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
ENTRYPOINT [ "npm", "run", "start:prod"]
