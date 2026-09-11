import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

import { useCart } from '../../../hooks/CartContext';
import { api } from '../../../services/api';
import './styles.css';

export default function CheckoutForm() {
  const { cartProducts, clearCart } = useCart();
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.error('Stripe ou Elements com falha, tente novamente');
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      setMessage(error.message);
      toast.error(error.message);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        const products = cartProducts.map((product) => {
          return {
            id: product.id,
            quantity: product.quantity,
            price: product.price,
          };
        });

        const { status } = await api.post(
          '/orders',
          { products },
          {
            validateStatus: () => true,
          },
        );

        if (status === 200 || status === 201) {
          clearCart();
          toast.success('Pedido Realizado com Sucesso!');

          setTimeout(() => {
            navigate(
              `/complete?payment_intent_client_secret=${paymentIntent.client_secret}`,
            );
          }, 3000);
        } else if (status === 409) {
          toast.error('Falha ao realizar o seu pedido');
        } else {
          throw new Error();
        }
      } catch (err) {
        console.error('Erro ao registrar o pedido:', err);
        toast.error('😭 Falha no Sistema! Tente novamente!');
      }
    } else {
      navigate(
        `/complete?payment_intent_client_secret=${paymentIntent?.client_secret}`,
      );
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: 'tabs',
  };

  return (
    <div className="container">
      <form id="payment-form" onSubmit={handleSubmit}>
        <PaymentElement id="payment-element" options={paymentElementOptions} />
        <button
          disabled={isLoading || !stripe || !elements}
          id="submit"
          className="button"
        >
          <span id="button-text">
            {isLoading ? (
              <div className="spinner" id="spinner"></div>
            ) : (
              'Pagar Agora'
            )}
          </span>
        </button>
        {message && <div id="payment-message">{message}</div>}
      </form>
    </div>
  );
}
