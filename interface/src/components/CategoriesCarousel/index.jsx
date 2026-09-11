import { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import { toast } from 'react-toastify';
import 'react-multi-carousel/lib/styles.css';

import { api } from '../../services/api';
import { Container, ContainerItems, Title, CategoryButton } from './styles';

const CarouselFix = Carousel.default || Carousel;

export function CategoriesCarousel() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const { data } = await api.get('/categories');
        setCategories(data);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        toast.error('Nao foi possivel carregar as categorias.');
      }
    }
    loadCategories();
  }, []);

  const responsive = {
    superLargedesktop: { breakpoint: { max: 4000, min: 3000 }, items: 4 },
    desktop: { breakpoint: { max: 3000, min: 1280 }, items: 4 },
    tablet: { breakpoint: { max: 1280, min: 690 }, items: 3 },
    mobile: { breakpoint: { max: 690, min: 0 }, items: 2 },
  };

  return (
    <Container>
      <Title>Categorias</Title>
      <CarouselFix
        responsive={responsive}
        infinite
        partialVisible={false}
        itemClass="carousel-item"
      >
        {categories.map((category) => (
          <ContainerItems key={category.id} $imageUrl={category.url}>
            <CategoryButton to={`/cardapio?categoria=${category.id}`}>
              {category.name}
            </CategoryButton>
          </ContainerItems>
        ))}
      </CarouselFix>
    </Container>
  );
}
