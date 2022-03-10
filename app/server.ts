require('dotenv').config();
import express from 'express';
import routes from './routes'
import client from './client';

const app = express();
const port = 3000;

client

app.use(express.json());

app.use("/", routes)

app.listen(port, () => {
    console.log(`⚡️ Running on ${port}.`);
});