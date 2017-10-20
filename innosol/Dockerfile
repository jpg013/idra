FROM node:latest

RUN useradd --user-group --create-home --shell /bin/false app

ENV HOME=/home/app

WORKDIR $HOME/innosol

COPY package.json $HOME/innosol/

RUN chown -R app:app $HOME/*

RUN npm install

COPY . $HOME/innosol

EXPOSE 3030

CMD ["npm", "start"]
