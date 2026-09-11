import { OffersCarousel, CategoriesCarousel } from '../../components';
import { Banner, Container } from './styles';

export function Home() {
  return (
    <>
      <Banner>
        <h1>Bem-vindo(a)!</h1>
      </Banner>
      <Container>
        <div>
          <CategoriesCarousel />
          <OffersCarousel />
        </div>
      </Container>
    </>
  );
}
