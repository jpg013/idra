FROM node:latest

RUN useradd --user-group --create-home --shell /bin/false app

ENV HOME=/home/app

WORKDIR $HOME/serviceRegistry

COPY package.json $HOME/serviceRegistry/

RUN chown -R app:app $HOME/*

RUN npm install

COPY . $HOME/serviceRegistry

EXPOSE 6969

CMD ["npm", "start"]
