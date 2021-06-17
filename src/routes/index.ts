import { Router } from 'express';
import userRoutes from './user.routes';
import productRoutes from './products.routes';
import adminRoutes from './admin.routes';
import orderRouter from './order.routes';

import adminBro from '../config/admin';

const routes = Router();

routes.use('/user', userRoutes);
routes.use('/products', productRoutes);
routes.use('/orders', orderRouter);
routes.use(adminBro.options.rootPath, adminRoutes);

export default routes;
