import http = require('http');
import express = require('express');

import fs = require('fs');
import childProcess = require('child_process');
import parse = require('csv-parse');

import Hackathon from './Hackathon';

const app = express();
const server = http.createServer(app);

let hackathons: Hackathon[] = [];

app.get('/list', (req, res) => {

  res.json(hackathons);
});

const port = 6000;
server.listen(port, () => console.log(`Listening on port ${port}.`));

const parser = parse({ delimiter: ',' }, (err: any | Error, data: any) => {
  // TODO: store data into hackathons
  console.log(data);
});

function updateDatabase() {
  const scraperDir = `${__dirname}/../scraper`;
  const scraper = childProcess.spawn('python', [ `${scraperDir}/scraper.py` ]);

  scraper.on('exit', () => {
    fs.createReadStream(`${scraperDir}/data.csv`).pipe(parser);
  });
}

function exitHandler() {
  console.log('Initiating shut down sequence...');
  server.close(() => console.log('Server shut down.'));
  clearInterval(interval);
}

const interval = setInterval(updateDatabase, 1000 * 60 * 60); // Update database every hour
updateDatabase();

//do something when app is closing
process.on('exit', exitHandler);

//catches ctrl+c event
process.on('SIGINT', exitHandler);

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler);
process.on('SIGUSR2', exitHandler);

//catches uncaught exceptions
process.on('uncaughtException', exitHandler);
