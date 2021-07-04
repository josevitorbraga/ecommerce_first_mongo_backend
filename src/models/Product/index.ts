import { Schema, model } from 'mongoose';

const currentDate = new Date();
const brazilDate = currentDate.setHours(currentDate.getHours() - 3);

const ProductsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: 'defaultImg.jpg',
  },
  price: {
    type: Number,
    required: true,
  },
  countInStock: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  created_at: {
    type: Date,
    default: brazilDate,
  },
  updated_at: {
    type: Date,
    default: brazilDate,
  },
});

const Item = model('product', ProductsSchema);

export default Item;
