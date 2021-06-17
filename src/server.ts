import * as dotenv from 'dotenv';
import * as express from 'express';
import * as cors from 'cors';
import * as mongoose from 'mongoose';

import db from './config/database';

import routes from './routes/index';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static('tmp'));

app.use(cors());
app.use(routes);

app.get('/config/paypal', (request, response) => {
  response.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});
const run = async () => {
  await mongoose
    .connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => console.log('🎲 Database connected...'))
    .catch(err => console.log(err));

  app.listen('3333', () => {
    console.log('🚀 Backend Iniciado na porta 3333');
  });
};

run();
