import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port: ${process.env.PORT}`));
