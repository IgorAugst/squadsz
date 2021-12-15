const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const { NODE_PORT } = require('./config/base');
const routes = require('./routes');

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: 'http://localhost:4000',
    credentials: true,
  })
);
app.use(express.json());

app.use(routes);

app.listen(NODE_PORT, () => console.log(`Listening on port: ${NODE_PORT}`));
