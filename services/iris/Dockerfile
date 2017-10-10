FROM node:latest

WORKDIR /usr/src/iris

# Create app directory
COPY package.json /usr/src/iris

RUN npm install

COPY . /usr/src/iris

CMD [ "npm", "start" ]
