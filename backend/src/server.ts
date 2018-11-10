import express = require('express');
import Hackathon from './Hackathon';
const app = express();

app.get('list', (req, res) => {
  let hackathons: Hackathon[] = [];

  res.json(hackathons);
});
