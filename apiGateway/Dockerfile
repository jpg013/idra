FROM node:latest

RUN useradd --user-group --create-home --shell /bin/false app

ENV HOME=/home/app

WORKDIR $HOME/apiGateway

COPY package.json $HOME/apiGateway/

RUN chown -R app:app $HOME/*

RUN npm install

COPY . $HOME/apiGateway

EXPOSE 8080

CMD ["npm", "start"]
