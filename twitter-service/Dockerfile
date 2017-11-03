FROM node:latest

RUN useradd --user-group --create-home --shell /bin/false app

ENV HOME=/home/app

WORKDIR $HOME/twitter-service

COPY package.json $HOME/twitter-service/

RUN chown -R app:app $HOME/*

RUN npm install

COPY . $HOME/twitter-service

EXPOSE 3040

CMD ["npm", "start"]
