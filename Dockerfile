FROM node:10

WORKDIR /app

RUN npm install --global mocha && npm install --save sequelize-cli
COPY . /app
COPY /opt/gitlab-runner/appconfig/polls/config.json /app/config/config.json

RUN npm install 

EXPOSE 3000
CMD [ "node", "index.js" ]

