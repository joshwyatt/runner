const exec = require('child_process').execSync;

const express = require('express');
const app = express();

const redis = require('redis');

const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);

const id = exec('cat /proc/self/cgroup | head -n 1 | cut -d "/" -f 3').toString().substr(0, 10);
let count = 0;

app.get('/', addHandler);
app.get('/add', addHandler);
app.get('/pop', popHandler);
app.get('/flush', flushHandler);

app.listen(8000, () => console.log('listening on 8000'));

function popHandler(req, res) {
  let client = redis.createClient(6379, 'redis');
  client.rpopAsync('nums')
    .then((results) => {
      let message = id + ' ' + results;
      console.log(message);
      res.send(message + '\n');
      client.quit();
    });
}

function flushHandler(req, res) {
  let client = redis.createClient(6379, 'redis');
  client.flushallAsync()
    .then(function(result) {
      let message = id + ' ' + result + ' server flushed\n';
      console.log(message);
      res.send(message + '\n');
      client.quit();
    });
}

function addHandler(req, res) {
  let client = redis.createClient(6379, 'redis');
  client.lindexAsync('nums', -1)
    .then((results) => {
      return client.rpushAsync('nums', Number(results) + 1)
    })
    .then((results) => {
      return client.llenAsync('nums');
    })
    .then((results) => {
      let message = id + ' ' + results;
      console.log(message);
      res.send(message + '\n');
      client.quit();
    });
}

