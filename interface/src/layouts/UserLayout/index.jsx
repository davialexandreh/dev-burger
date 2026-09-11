import { Navigate, Outlet } from 'react-router-dom';

import { Footer, Header } from '../../components';
import { Container, Main } from './styles';

export function UserLayout() {
  const userData = localStorage.getItem('devburger:userData');

  if (!userData) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Container>
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </Container>
  );
}
