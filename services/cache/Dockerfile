FROM node:latest

WORKDIR /usr/src/cache

# Create app directory
COPY package.json /usr/src/cache

RUN npm install

COPY . /usr/src/cache

CMD [ "npm", "start" ]
