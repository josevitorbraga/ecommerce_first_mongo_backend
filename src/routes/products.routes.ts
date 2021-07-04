import { Router } from 'express';
import * as multer from 'multer';

import * as path from 'path';
import * as fs from 'fs';

import uploadConfig from '../config/upload';
import Product from '../models/Product';
import UpdateProductImageService from '../services/UpdateProductImage';
import { isAdmin, isAuth } from '../utils/utils';

const productRoutes = Router();
const upload = multer(uploadConfig);

productRoutes.post('/', isAuth, isAdmin, async (request, response) => {
  const product = new Product({
    name: `samle name ${Date.now()} `,
    image: 'defaultImg.jpg',
    price: 0,
    category: 'sample category',
    countInStock: 0,
    description: 'sample description',
  });
  const createdProduct = await product.save();
  response.send({ message: 'Product Created', product: createdProduct });
});

productRoutes.patch(
  '/:id/image',
  upload.single('image'),
  isAuth,
  isAdmin,
  async (request, response) => {
    try {
      const { id } = request.params;

      const updateProductImage = new UpdateProductImageService();
      const product: any = await updateProductImage.execute({
        product_id: id,
        imageFileName: request.file.filename,
      });
      return response.send(product.image);
    } catch (err) {
      return response.json({ error: err.message });
    }
  },
);

productRoutes.get('/', async (request, response) => {
  const name = request.query.name || '';
  const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {};
  const products = await Product.find({ ...nameFilter });
  response.send(products);
});

productRoutes.get('/:id', async (request, response) => {
  const { id } = request.params;
  try {
    const product = await Product.findById(id);
    return response.json(product);
  } catch (err) {
    return response.status(404).json({ error: err.message });
  }
});

productRoutes.put('/:id', isAuth, isAdmin, async (request, response) => {
  const { id } = request.params;
  const { name, price, image, category, countInStock, description } =
    request.body;
  const product = await Product.findById(id);
  if (product) {
    product.name = name;
    product.price = price;
    product.image = image;
    product.category = category;
    product.countInStock = countInStock;
    product.description = description;

    const updatedProduct = await product.save();
    return response.send({
      message: 'Product Updated',
      product: updatedProduct,
    });
  }
  return response.status(404).send({ message: 'Product not found' });
});

productRoutes.delete('/:id', isAuth, isAdmin, async (request, response) => {
  const { id } = request.params;
  const product = await Product.findById(id);
  if (product) {
    if (product.image !== 'defaultImg.jpg') {
      const productImageFilePath = path.join(
        uploadConfig.directory,
        product.image,
      );
      const productImageFileExists = await fs.promises.stat(
        productImageFilePath,
      );
      if (productImageFileExists) {
        await fs.promises.unlink(productImageFilePath);
      }
    }
    const deleteProduct = await product.remove();

    return response.send({
      message: 'Product removed',
      product: deleteProduct,
    });
  }
  return response.status(404).send({ message: 'Product not found' });
});

export default productRoutes;
