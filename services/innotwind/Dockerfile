FROM node:latest

WORKDIR /usr/src/innotwind

# Create app directory
COPY package.json /usr/src/innotwind

RUN npm install

COPY . /usr/src/innotwind

CMD [ "npm", "start" ]
