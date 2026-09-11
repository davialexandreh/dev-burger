import { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import { toast } from 'react-toastify';
import 'react-multi-carousel/lib/styles.css';

import { api } from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';
import { CardProduct } from '../CardProduct';
import { Container, Title } from './styles';

const CarouselFix = Carousel.default || Carousel;

export function OffersCarousel() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const { data } = await api.get('/products');

        const onlyOffers = data
          .filter((product) => product.offer)
          .map((product) => ({
            ...product,
            currencyValue: formatPrice(product.price),
          }));

        setOffers(onlyOffers);
      } catch (error) {
        console.error('Erro ao carregar ofertas:', error);
        toast.error('Nao foi possivel carregar as ofertas.');
      }
    }

    loadProducts();
  }, []);

  const responsive = {
    superLargedesktop: { breakpoint: { max: 4000, min: 3000 }, items: 4 },
    desktop: { breakpoint: { max: 3000, min: 1280 }, items: 4 },
    tablet: { breakpoint: { max: 1280, min: 690 }, items: 3 },
    mobile: { breakpoint: { max: 690, min: 0 }, items: 2 },
  };

  return (
    <Container>
      <Title>Ofertas do Dia</Title>

      <CarouselFix
        responsive={responsive}
        infinite
        partialVisible={false}
        itemClass="carousel-item"
      >
        {offers.map((product) => (
          <CardProduct key={product.id} product={product} />
        ))}
      </CarouselFix>
    </Container>
  );
}
