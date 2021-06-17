import * as AdminBroExpress from '@admin-bro/express';

import adminBro from '../config/admin';

// @ts-expect-error tive que importar * para o import funcionar
const router = AdminBroExpress.buildRouter(adminBro);

export default router;
