import express from 'express';
import axios from 'axios';
import cors from 'cors';

import fs = require('fs');
import childProcess = require('child_process');
import parse from 'csv-parse';

import Hackathon, { Date, Location } from './Hackathon';

const apiKey: string = process.env.API_KEY || '';
const geocodeUrl = (address: string) =>
  `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`;

const app = express();

const corsOptionsDelegate = (req: any, callback: any) => {
  let corsOptions;

  const whitelist = [
    'https://hackmapp.com',
    'https://hackm.app',
  ];
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

app.use(cors(corsOptionsDelegate));

let hackathons: Hackathon[] = [];

app.get('/list', (req, res) => {
  res.json(hackathons);
});

const port = 6000;
app.listen(port, () => console.log(`Listening on port ${port}.`));

const accChars = 'ŠŽšžŸÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïðñòóôõöùúûüýÿ'.split('');
const regChars = 'SZszYAAAAAACEEEEIIIIDNOOOOOUUUUYaaaaaaceeeeiiiidnooooouuuuyy'.split('');
function cleanAccents(input: string) {
  let output = input;
  accChars.forEach((accChar, i) => {
    output = output.replace(accChar, regChars[i]);
  });
  return output;
}

// Parse the data csv and store it
const parser = () => parse({ delimiter: ',', columns: true }, (err: any | Error, data: any) => {
  // TODO: store data into hackathons
  hackathons = [];
  data.forEach((row: any) => {
    const address = `${row.Locality}, ${row.Region}`;
    axios.get(geocodeUrl(cleanAccents(address)))
      .then((response: any) => {
        if (response.data.status !== 'OK') return;

        let isUS: boolean = true;
        response.data.results[0].address_components.forEach((component: any) => {
          if (component.types[0] === 'country') {
            isUS = (component.short_name === 'US');
            return;
          }
        });

        if (!isUS) return;

        const location: Location = {
          longitude: parseFloat(response.data.results[0].geometry.location.lng),
          latitude: parseFloat(response.data.results[0].geometry.location.lat),
          name: address,
        };

        let hackathon: Hackathon = {
          name: row.Hackathon_Name,
          isHighSchool: row.High_School === '1',
          startDate: {
            year: parseInt(row.Start_Year),
            month: parseInt(row.Start_Month),
            day: parseInt(row.Start_Day),
          },
          endDate: {
            year: parseInt(row.End_Year),
            month: parseInt(row.End_Month),
            day: parseInt(row.End_Day),
          },
          location: location,
          url: row.URL,
        };

        hackathons.push(hackathon);
      }).catch((err) => console.log(err));
  });
  scraper.kill();
  readStream.close();
});

// Calls the scraper and updates the database with the data from the scraper
let readStream: fs.ReadStream;
let scraper: childProcess.ChildProcess;
function updateDatabase() {
  const scraperDir = `${__dirname}/../../scraper`;
  scraper = childProcess.spawn('python3', [ `${scraperDir}/scraper.py` ]);

  scraper.on('exit', () => {
    readStream = fs.createReadStream(`./hackathons.csv`);
    readStream.pipe(parser());
  });
}

function exitHandler() {
  console.log('Initiating shut down sequence...');
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
