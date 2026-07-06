import { Hono } from 'hono';
import { cors } from 'hono/cors';

import userRoutes from './routes/users';
import addressRoutes from './routes/addresses';
import walletRoutes from './routes/wallet';
import orderRoutes from './routes/orders';
import reviewRoutes from './routes/reviews';
import returnRoutes from './routes/returns';
import notificationRoutes from './routes/notifications';
import bulkRoutes from './routes/bulk';

// Create the API app
const app = new Hono<{ Bindings: any }>().basePath('/api/v1'); // Ensure we are using /api/v1 as frontend expects

// Middleware
app.use('*', cors());

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    message: 'Aurelia API is running',
  });
});

import authRoutes from './routes/auth';

// Mount Route groups
app.route('/auth', authRoutes);
app.route('/users', userRoutes);
app.route('/addresses', addressRoutes);
app.route('/wallet', walletRoutes);
app.route('/orders', orderRoutes);
app.route('/reviews', reviewRoutes);
app.route('/returns', returnRoutes);
app.route('/notifications', notificationRoutes);
app.route('/bulk', bulkRoutes);

// Fallback to old basePath for health just in case
const rootApp = new Hono();
rootApp.route('/', app);
rootApp.get('/api/health', (c) => c.json({ status: 'ok' }));

export default rootApp;
