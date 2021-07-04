import { Router } from 'express';
import Order from '../models/Order';

import { isAdmin, isAuth } from '../utils/utils';

const orderRouter = Router();

orderRouter.get('/mine', isAuth, async (request: any, response) => {
  const orders = await Order.find({ user: request.user._id });
  response.send(orders);
});

orderRouter.get('/', isAuth, isAdmin, async (request: any, response: any) => {
  const orders = await Order.find({})
    .populate('User', 'name')
    .sort({ created_at: -1 });
  return response.send(orders);
});

orderRouter.post('/', isAuth, async (request: any, response: any) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    } = request.body;
    if (orderItems.length === 0) {
      response.json({ error: 'The cart is empty' });
    } else {
      const order = new Order({
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
        user: request.user._id,
        userName: request.user.name,
      });
      const createdOrder = await order.save();
      response
        .status(201)
        .send({ message: 'Pedido criado', order: createdOrder });
    }
  } catch (err) {
    response.json({ error: err.message });
  }
});

orderRouter.get('/:id', isAuth, async (request, response) => {
  const order = await Order.findById(request.params.id);
  if (order) {
    response.send(order);
  } else {
    response.status(404).send({ message: 'Order Not Found' });
  }
});

orderRouter.put('/:id/pay', isAuth, async (request, response) => {
  const order = await Order.findById(request.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: request.body.id,
      status: request.body.status,
      update_time: request.body.update_time,
      email_address: request.body.email_address,
    };
    const updatedOrder = await order.save();
    response.send({ message: 'Pedido pago', order: updatedOrder });
  } else {
    response.status(404).send({ message: 'Order Not Found' });
  }
});

orderRouter.delete('/:id', isAuth, isAdmin, async (request, response) => {
  const order = await Order.findById(request.params.id);
  if (order) {
    const deleteOrder = await order.remove();
    response.send({ message: 'Order Deleted', order: deleteOrder });
  } else {
    response.status(404).send({ message: 'Order Not Found' });
  }
});

orderRouter.put('/:id/deliver', isAuth, isAdmin, async (request, response) => {
  const order = await Order.findById(request.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    response.send({ message: 'Order Delivered', order: updatedOrder });
  } else {
    response.status(404).send({ message: 'Order Not Found' });
  }
});

export default orderRouter;
