import express, { json } from 'express';
import cors from 'cors';
import { resolve } from 'path';
import { config } from 'dotenv';
import { dbConnection } from "./DB/connection.js";
import { globalResponse } from "./src/utils/errorHandeling.js";
import router from './src/modules/url.router.js'
import { deleteExpiredURLsCron } from './src/utils/cronJob.js';
import './analyticsConsumer.js';

config({ path: resolve('./config/.env') })
const app = express()

const allowedOrigins = [
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  credentials: true,
};

app.use(cors(corsOptions));

app.get('/', (req, res) => { res.json({ message: "hello app" }) })
app.use(json())
app.use('/', router)
app.all('*', (req, res, next) => {
  res.status(404).json({ message: '404 not found URL' })
})
deleteExpiredURLsCron()
app.use(globalResponse)
dbConnection()
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
