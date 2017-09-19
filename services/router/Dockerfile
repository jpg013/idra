FROM node:latest

WORKDIR /usr/src/router

# Create app directory
COPY package.json /usr/src/router

RUN npm install

COPY . /usr/src/router

CMD [ "npm", "start" ]
