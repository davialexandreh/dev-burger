import { Outlet, Navigate } from 'react-router-dom';

import { SideNavAdmin } from '../../components/SideNavAdmin';
import { Container } from './styles';

export function AdminLayout() {
  const userData = localStorage.getItem('devburger:userData');
  const isAdmin = userData ? JSON.parse(userData).admin : false;

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Container>
      <SideNavAdmin />
      <main>
        <section>
          <Outlet />
        </section>
      </main>
    </Container>
  );
}
