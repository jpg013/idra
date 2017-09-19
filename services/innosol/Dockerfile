FROM node:latest

WORKDIR /usr/src/innosol

# Create app directory
COPY package.json /usr/src/innosol

RUN npm install

COPY . /usr/src/innosol

CMD [ "npm", "start" ]
