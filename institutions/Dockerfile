FROM node:latest

RUN useradd --user-group --create-home --shell /bin/false app

ENV HOME=/home/app

WORKDIR $HOME/institutions

COPY package.json $HOME/institutions/

RUN chown -R app:app $HOME/*

RUN npm install

COPY . $HOME/institutions

EXPOSE 3031

CMD ["npm", "start"]
