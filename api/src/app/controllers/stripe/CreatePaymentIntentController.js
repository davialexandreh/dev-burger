import Stripe from 'stripe';
import * as Yup from 'yup';
import 'dotenv/config';

import Product from '../../models/Product.js';
import { DELIVERY_TAX } from '../../../config/delivery.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (items, products) => {
  const subtotal = items.reduce((acc, item) => {
    const product = products.find((p) => p.id === item.id);

    return product.price * item.quantity + acc;
  }, 0);

  return subtotal + DELIVERY_TAX;
};

class CreatePaymentIntentController {
  async store(request, response) {
    const schema = Yup.object().shape({
      products: Yup.array()
        .required()
        .of(
          Yup.object().shape({
            id: Yup.number().required(),
            quantity: Yup.number().required().positive().integer(),
          }),
        ),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { products } = request.body;

    const productsId = products.map((product) => product.id);

    const storedProducts = await Product.findAll({
      where: { id: productsId },
      attributes: ['id', 'price'],
    });

    if (storedProducts.length !== new Set(productsId).size) {
      return response.status(400).json({ error: 'Invalid product in the cart' });
    }

    const amount = calculateOrderAmount(products, storedProducts);

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'brl',
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return response.json({
        clientSecret: paymentIntent.client_secret,
        dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
      });
    } catch (err) {
      console.error('Falha ao criar payment intent:', err.message);

      if (err.type === 'StripeAuthenticationError') {
        return response.status(500).json({
          error:
            'Stripe nao configurado: defina STRIPE_SECRET_KEY no .env da API ' +
            '(use uma chave de teste sk_test_... de dashboard.stripe.com/test/apikeys).',
        });
      }

      return response.status(502).json({ error: err.message });
    }
  }
}

export default new CreatePaymentIntentController();
