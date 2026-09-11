import { Link } from 'react-router-dom';

import styled from 'styled-components';

import Background from '../../assets/background.svg';
import BannerHamburguer from '../../assets/banner-hamburguer.svg';

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #f0f0f0;

  background-image:
    linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)),
    url(${Background});
  background-size: cover;
  background-position: center;
  background-repeat: repeat;
  min-height: 100vh;
  width: 100%;
`;

export const Banner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 480px;

  @media (max-width: 768px) {
    height: 260px;
  }

  width: 100%;
  position: relative;

  background: url('${BannerHamburguer}') no-repeat;
  background-color: #1f1f1f;
  background-position: center;
  background-size: cover;

  h1 {
    font-family: 'Road Rage', sans-serif;
    font-size: clamp(32px, 7vw, 80px);
    line-height: 65px;
    position: absolute;
    color: #fff;

    right: 20%;
    top: 30%;

    span {
      display: block;
      color: #fff;
      font-size: 20px;
    }

    @media (max-width: 768px) {
      position: static;
      right: auto;
      top: auto;
      line-height: 1.1;
      text-align: center;
      padding: 0 16px;

      span {
        font-size: 14px;
        margin-top: 8px;
      }
    }
  }
`;

export const CategoryMenu = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 50px;
  margin-top: 30px;
  padding: 0 16px;

  @media (max-width: 768px) {
    gap: 20px;
  }
`;

export const CategoryButton = styled(Link)`
  text-decoration: none;
  cursor: pointer;
  background: none;
  color: ${(props) =>
    props.$isActiveCategory ? props.theme.purple : '#696969'};
  font-size: 24px;
  font-weight: 500;
  padding-bottom: 5px;

  @media (max-width: 768px) {
    font-size: 18px;
  }

  line-height: 20px;
  border: none;
  transition:
    color 200ms,
    opacity 200ms;

  &:hover {
    opacity: 0.6;
  }
`;

export const ProductsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  padding: 40px;
  gap: 60px;
  justify-content: center;
  max-width: 1280px;
  margin: 50px auto;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    padding: 20px;
    gap: 30px;
    margin: 30px auto;
  }
`;
