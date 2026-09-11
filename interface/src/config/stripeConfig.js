import { loadStripe } from '@stripe/stripe-js';

// Defina VITE_STRIPE_PUBLISHABLE_KEY em .env.local para habilitar o checkout.
const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

const stripePromise = publishableKey
  ? loadStripe(publishableKey)
  : Promise.resolve(null);

export default stripePromise;
