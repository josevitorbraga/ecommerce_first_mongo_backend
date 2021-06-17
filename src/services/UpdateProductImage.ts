import * as path from 'path';
import * as fs from 'fs';

import Product from '../models/Product';

import uploadConfig from '../config/upload';

interface Request {
  product_id: string;
  imageFileName: string;
}

class UpdateProductImageService {
  public async execute({
    product_id,
    imageFileName,
  }: Request): Promise<typeof Product> {
    const product = await Product.findById(product_id);

    if (!product) {
      throw new Error('This product does not exists...');
    }
    if (product.image && product.image !== 'defaultImg.jpg') {
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
    product.image = imageFileName;
    await Product.findOneAndUpdate({ _id: product_id }, product);

    return product;
  }
}

export default UpdateProductImageService;
