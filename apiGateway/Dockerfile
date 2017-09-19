FROM node:latest

WORKDIR /usr/src/apiGateway

# Create app directory
COPY package.json /usr/src/apiGateway

RUN npm install

COPY . /usr/src/apiGateway

CMD [ "npm", "start" ]
