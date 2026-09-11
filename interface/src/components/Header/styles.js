import { Link } from 'react-router-dom';

import styled from 'styled-components';

export const Container = styled.div`
  position: sticky;
  top: 0;
  z-index: 1100;

  background-color: ${(props) => props.theme.mainBlack};
  width: 100%;
  height: 72px;
  padding: 0 56px;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  max-width: 1280px;
  height: 100%;
  margin: 0 auto;
`;

export const Navigation = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;

  div {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;

    @media (max-width: 768px) {
      gap: 10px;
    }
  }
`;

export const Separator = styled.span`
  display: block;
  width: 1px;
  height: 24px;
  background-color: ${(props) => props.theme.darkGray};
`;

export const HeaderLink = styled(Link)`
  color: ${(props) =>
    props.$isActive ? props.theme.purple : props.theme.white};
  border-bottom: ${(props) =>
    props.$isActive
      ? `1px solid ${props.theme.purple}`
      : '1px solid transparent'};
  padding-bottom: 5px;
  text-decoration: none;
  font-size: 14px;
  transition:
    color 200ms,
    border-color 200ms;

  &:hover {
    color: ${(props) => props.theme.purple};
  }
`;

export const CartLink = styled(HeaderLink)`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 600px) {
    font-size: 0;
    gap: 0;
  }
`;

export const CartIconWrapper = styled.span`
  position: relative;
  display: flex;
  align-items: center;
`;

export const CartBadge = styled.span`
  position: absolute;
  top: -6px;
  right: -8px;

  display: flex;
  align-items: center;
  justify-content: center;

  min-width: 18px;
  height: 18px;
  padding: 0 5px;

  background-color: ${(props) => props.theme.purple};
  color: ${(props) => props.theme.white};
  border-radius: 9px;

  font-size: 11px;
  font-weight: 700;
  line-height: 1;
`;

export const Options = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 48px;

  @media (max-width: 768px) {
    gap: 16px;
  }
`;

export const Profile = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 14px;

  p {
    color: ${(props) => props.theme.white};
    line-height: 130%;
    font-weight: 300;

    span {
      font-weight: 700;
      color: ${(props) => props.theme.purple};
    }
  }

  @media (max-width: 600px) {
    gap: 6px;

    p {
      display: none;
    }
  }
`;

export const Logout = styled.button`
  color: ${(props) => props.theme.red};
  text-decoration: none;
  font-weight: 700;
  font-size: 14px;
  background-color: transparent;
  border: none;
  padding: 0;
`;
