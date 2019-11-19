const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');
const tanker = require('@tanker/identity');


const app = express();
const port = 3001;
const appID = 'YOUR_APP_ID';
const appSecret = 'YOUR_APP_SECRET';

const users = {};

app.use(bodyParser.json());

app.post('/identity', async (req, res) => {
  const email = req.body.email;
  if (!email) {
    return res.status(400).json({ error: 'no email provided' });
  }

  const user = users[email] || {};
  if (!user.tankerIdentity) {
    user.id = uuid();
    user.tankerIdentity = await tanker.createIdentity(appID, appSecret, user.id);
    user.registered = false;
    users[email] = user;
  }
  res.json(user);
});

app.patch('/identity', async (req, res) => {
  const email = req.body.email;
  if (!email) {
    return res.status(400).json({ error: 'no email provided' });
  }

  if (!(email in users)) {
    return res.status(400).json({ error: 'unkwnown user' });
  }

  const user = users[email];
  user.registered = true;
  users[email] = user;

  res.sendStatus(200);
});

app.post('/public_identity', async (req, res) => {
  const email = req.body.email;
  if (!email) {
    return res.status(400).json({ error: 'no email provided' });
  }

  let identity;
  const user = users[email] || {};
  if (user.tankerIdentity && user.registered) {
    identity = user.tankerIdentity;
  } else if (user.provisionalIdentity) {
    identity = user.provisionalIdentity;
  } else {
    identity = await tanker.createProvisionalIdentity(appID, email);
    users[email] = { provisionalIdentity: identity };
  }
  res.json({ publicIdentity: await tanker.getPublicIdentity(identity) });
});

app.listen(port, () => console.log(`Identity server listening on port ${port}!`));
