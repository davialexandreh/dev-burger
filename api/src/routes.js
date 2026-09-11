import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer.js';

import ProductController from './app/controllers/ProductController.js';
import SessionController from './app/controllers/SessionController.js';
import CategoryController from './app/controllers/CategoryController.js';
import UserController from './app/controllers/UserController.js';
import OrderController from './app/controllers/OrderController.js';
import CreatePaymentIntentController from './app/controllers/stripe/CreatePaymentIntentController.js';
import DeliveryTaxController from './app/controllers/DeliveryTaxController.js';

import authMiddleware from './app/middlewares/auth.js';
import asyncHandler from './app/middlewares/asyncHandler.js';

const upload = multer(multerConfig);

const routes = new Router();

routes.post('/users', asyncHandler(UserController.store));

routes.post('/sessions', asyncHandler(SessionController.store));

routes.use(authMiddleware);

routes.post('/products', upload.single('file'), asyncHandler(ProductController.store));
routes.get('/products', asyncHandler(ProductController.index));
routes.put('/products/:id', upload.single('file'), asyncHandler(ProductController.update));

routes.post('/categories', upload.single('file'), asyncHandler(CategoryController.store));
routes.get('/categories', asyncHandler(CategoryController.index));
routes.put('/categories/:id', upload.single('file'), asyncHandler(CategoryController.update));

routes.post('/orders', asyncHandler(OrderController.store));
routes.put('/orders/:id', asyncHandler(OrderController.update));
routes.get('/orders', asyncHandler(OrderController.index));

routes.get('/delivery-tax', asyncHandler(DeliveryTaxController.index));

routes.post('/create-payment-intent', asyncHandler(CreatePaymentIntentController.store));

export default routes;
