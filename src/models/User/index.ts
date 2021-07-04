import { Schema, model } from 'mongoose';

const currentDate = new Date();
const brazilDate = currentDate.setHours(currentDate.getHours() - 3);

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
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

const Item = model('user', UserSchema);

export default Item;
