import * as dotenv from 'dotenv';
import * as express from 'express';
import * as cors from 'cors';
import * as mongoose from 'mongoose';
import * as mercadopago from 'mercadopago';

import db from './config/database';

import routes from './routes/index';
import Order from './models/Order';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static('tmp'));

app.use(cors());
app.use(routes);

app.get('/config/paypal', (request, response) => {
  response.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

mercadopago.configure({
  access_token:
    ' TEST-8900737990220749-060119-ab168e57375b0c97b71f3d8bd2f23e11-445436617 ',
});

app.post('/mercadopago', (request, response: any) => {
  const preference = {
    back_urls: {
      failure: `http://localhost:3333/fail/${request.body._id}`,
      success: `http://localhost:3333/success/${request.body._id}`,
    },
    items: [
      {
        title: `Pedido #${request.body._id}`,
        quantity: 1,
        unit_price: request.body.itemsPrice,
      },
    ],
  };

  mercadopago.preferences
    .create(preference)
    .then(function (res) {
      // Este valor substituirá a string "<%= global.id %>" no seu HTML
      return response.send(res.body.sandbox_init_point);
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.get('/success/:orderId', async (request, response) => {
  // console.log(request.query);
  // return response.send(request.query.collection_status);
  const { orderId } = request.params;

  const order = await Order.findById(orderId);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = request.query;
    await order.save();
  }
  return response.redirect(`http://localhost:3000/order/${orderId}`);
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

// {
//   collection_id: '1237914453',
//   collection_status: 'approved',
//   payment_id: '1237914453',
//   status: 'approved',
//   external_reference: 'null',
//   payment_type: 'credit_card',
//   merchant_order_id: '2856133472',
//   preference_id: '445436617-bc4e4919-a34b-4d18-b5e7-d8708c0d8df9',
//   site_id: 'MLB',
//   processing_mode: 'aggregator',
//   merchant_account_id: 'null'
// }
