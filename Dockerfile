FROM node:7.8.0-alpine

RUN mkdir app
ADD package.json app
WORKDIR /app
RUN npm install
ADD . .
EXPOSE 8000

CMD ["node", "index.js"]
