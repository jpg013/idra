FROM node:latest

RUN useradd --user-group --create-home --shell /bin/false app

ENV HOME=/home/app

WORKDIR $HOME/users

COPY package.json $HOME/users/

RUN chown -R app:app $HOME/*

RUN npm install

COPY . $HOME/users

EXPOSE 3030

CMD ["npm", "start"]
