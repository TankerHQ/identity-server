const express = require('express');
const bodyParser = require('body-parser');


const app = express();
const port = 3001;

app.use(bodyParser.json());

app.post('/identity', (req, res) => res.send('Hello, you are on the identity route'));

app.listen(port, () => console.log(`Identity server listening on port ${port}!`));
