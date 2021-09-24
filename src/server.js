const dotenv = require('dotenv');
const express = require('express');
const routes = require('./routes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/public', express.static('public'));
app.use(routes);
app.set('views', 'src/views/pages');
app.set('view engine', 'ejs');

app.listen(port, () => console.log(`Listening on port: ${process.env.PORT}`));
