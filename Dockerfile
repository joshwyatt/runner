FROM mhart/alpine-node:6.6

RUN mkdir app
ADD package.json app
WORKDIR /app
RUN npm install
ADD . .
EXPOSE 8000

CMD ["node", "index.js"]
