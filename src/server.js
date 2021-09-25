const dotenv = require('dotenv');
const express = require('express');
const { NODE_PORT } = require('./config/base');
const routes = require('./routes');

dotenv.config();

const server = express();

server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use('/public', express.static('public'));
server.use(routes);
server.set('views', 'src/views/pages');
server.set('view engine', 'ejs');

server.listen(NODE_PORT, () => console.log(`Listening on port: ${NODE_PORT}`));
