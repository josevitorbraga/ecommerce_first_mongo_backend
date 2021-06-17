import AdminBro from 'admin-bro';
import { Database, Resource } from '@admin-bro/mongoose';

import Product from '../models/Product';

AdminBro.registerAdapter({ Database, Resource });

const adminBro = new AdminBro({
  databases: [],
  resources: [
    {
      resource: Product,
      options: {
        properties: {
          image: {
            isVisible: { edit: false, list: true, show: true, filter: true },
          },
          created_at: {
            isVisible: { edit: false, list: true, show: true, filter: true },
          },
          updated_at: {
            isVisible: { edit: false, list: true, show: true, filter: true },
          },
        },
      },
    },
  ],
  locale: {
    language: 'pt-br',
    translations: {
      labels: {
        Navigation: 'Administracao',
        Product: 'Meus Produtos',
      },
    },
  },
  rootPath: '/admin',
});

export default adminBro;
