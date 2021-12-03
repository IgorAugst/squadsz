const dotenv = require('dotenv');
const express = require('express');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
const { NODE_PORT } = require('./config/base');
const routes = require('./routes');

const Auth = require('./auth');

const EmployeeAuth = new Auth('employee');
const CompanyAuth = new Auth('company');

EmployeeAuth.initialize(passport);
CompanyAuth.initialize(passport);

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use('/public', express.static('public'));
app.use(routes);
app.set('views', 'app/views/pages');
app.set('view engine', 'ejs');

app.listen(NODE_PORT, () => console.log(`Listening on port: ${NODE_PORT}`));
