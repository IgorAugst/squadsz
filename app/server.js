const dotenv = require('dotenv');
const express = require('express');
const session = require('express-session');
var cookieParser = require('cookie-parser');
const flash = require('express-flash')
const passport = require('passport');
const { NODE_PORT } = require('../config/base');
const routes = require('./routes');

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/public', express.static('public'));
app.use(routes);
app.use(flash());
app.use(cookieParser);
app.use(session({
  secret:"123456789",
  resave: false,
  saveUninitialized:true}));
app.set('views', 'app/views/pages');
app.set('view engine', 'ejs');

app.listen(NODE_PORT, () => console.log(`Listening on port: ${NODE_PORT}`));
