FROM node:latest

WORKDIR /usr/src/nova

# Create app directory
COPY package.json /usr/src/nova

RUN npm install

COPY . /usr/src/nova

CMD [ "npm", "start" ]
