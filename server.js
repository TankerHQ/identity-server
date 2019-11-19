const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');
const tanker = require('@tanker/identity');


const app = express();
const port = 3001;
const appID = 'YOUR_APP_ID';
const appSecret = 'YOUR_APP_SECRET';

app.use(bodyParser.json());

app.post('/identity', async (req, res) => {
  const id = uuid();
  const tankerIdentity = await tanker.createIdentity(appID, appSecret, id);
  const user = {
    id,
    tankerIdentity,
  }
  res.json(user);
});

app.listen(port, () => console.log(`Identity server listening on port ${port}!`));
