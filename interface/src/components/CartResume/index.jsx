import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useCart } from '../../hooks/CartContext';
import { api } from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';
import { Button } from '../Button';
import { Container } from './styles';

export function CartResume() {
  const [deliveryTax, setDeliveryTax] = useState(null);

  const navigate = useNavigate();

  const { cartProducts } = useCart();

  const finalPrice = cartProducts.reduce(
    (acc, current) => current.price * current.quantity + acc,
    0,
  );

  useEffect(() => {
    async function loadDeliveryTax() {
      try {
        const { data } = await api.get('/delivery-tax');

        setDeliveryTax(data.deliveryTax);
      } catch (error) {
        console.error('Erro ao carregar a taxa de entrega:', error);
        toast.error('Nao foi possivel carregar a taxa de entrega.');
      }
    }

    loadDeliveryTax();
  }, []);

  const submitOrder = async () => {
    const products = cartProducts.map((product) => {
      return {
        id: product.id,
        quantity: product.quantity,
      };
    });

    try {
      const { data } = await api.post('/create-payment-intent', { products });

      navigate('/checkout', {
        state: data,
      });
    } catch (err) {
      console.error('Erro ao iniciar o pagamento:', err);
      toast.error('Erro, tente novamente!');
    }
  };

  return (
    <div>
      <Container>
        <div className="container-top">
          <h2 className="title">Resumo do Pedido</h2>
          <p className="items">Items</p>
          <p className="items-price">{formatPrice(finalPrice)}</p>
          <p className="delivery-tax">Taxa de Entrega</p>
          <p className="delivery-tax-price">
            {deliveryTax === null ? '--' : formatPrice(deliveryTax)}
          </p>
        </div>
        <div className="container-bottom">
          <p>Total</p>
          <p>
            {deliveryTax === null
              ? '--'
              : formatPrice(finalPrice + deliveryTax)}
          </p>
        </div>
      </Container>
      <Button onClick={submitOrder} disabled={deliveryTax === null}>
        Finalizar Pedido
      </Button>
    </div>
  );
}
