import { useLocation, useNavigate } from 'react-router-dom';

import { UserCircle, ShoppingCart } from '@phosphor-icons/react';

import { useCart } from '../../hooks/CartContext';
import { useUser } from '../../hooks/UserContext';
import {
  CartBadge,
  CartIconWrapper,
  CartLink,
  Container,
  Content,
  HeaderLink,
  Logout,
  Navigation,
  Options,
  Profile,
  Separator,
} from './styles';

export function Header() {
  const navigate = useNavigate();
  const { logout, userInfo } = useUser();
  const { cartQuantity } = useCart();

  const { pathname } = useLocation();

  function logoutUser() {
    logout();
    navigate('/login');
  }

  return (
    <Container>
      <Content>
        <Navigation>
          <div>
            <HeaderLink to="/" $isActive={pathname === '/'}>
              Home
            </HeaderLink>
            <Separator aria-hidden="true" />
            <HeaderLink to="/cardapio" $isActive={pathname === '/cardapio'}>
              Cardápio
            </HeaderLink>
          </div>
        </Navigation>

        <Options>
          <Profile>
            <UserCircle color="#fff" size={24} aria-hidden="true" />
            <div>
              <p>
                Olá, <span>{userInfo?.name ?? 'visitante'}</span>
              </p>
              <Logout type="button" onClick={logoutUser}>
                Sair
              </Logout>
            </div>
          </Profile>

          <CartLink to="/carrinho" $isActive={pathname === '/carrinho'}>
            <CartIconWrapper>
              <ShoppingCart color="#fff" size={24} aria-hidden="true" />
              {cartQuantity > 0 && (
                <CartBadge aria-label={`${cartQuantity} itens no carrinho`}>
                  {cartQuantity > 99 ? '99+' : cartQuantity}
                </CartBadge>
              )}
            </CartIconWrapper>
            Carrinho
          </CartLink>
        </Options>
      </Content>
    </Container>
  );
}
