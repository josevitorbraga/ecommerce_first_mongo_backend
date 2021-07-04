import { Schema, model } from 'mongoose';

const currentDate = new Date();
const brazilDate = currentDate.setHours(currentDate.getHours() - 3);

const orderSchema = new Schema({
  orderItems: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    },
  ],
  shippingAddress: {
    fullName: { type: String, required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  paymentMethod: { type: String, required: true },
  paymentResult: {
    id: String,
    status: String,
    date_time: String,
    email_address: String,
  },
  itemsPrice: { type: Number, required: true },
  shippingPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, ref: 'User', required: true },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
  isDelivered: { type: Boolean, default: false },
  deliveredAt: { type: Date },
  created_at: {
    type: Date,
    default: brazilDate,
  },
  updated_at: {
    type: Date,
    default: brazilDate,
  },
});

const Order = model('order', orderSchema);
export default Order;
