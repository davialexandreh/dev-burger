import styled from 'styled-components';

import Background from '../../assets/background.svg';
import Texture from '../../assets/texture.svg';

export const Container = styled.div`
  width: 100%;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)),
    url(${Background});
  background-size: cover;
  background-position: center;
  background-repeat: repeat;
  min-height: 100vh;
  width: 100%;
  background: url('${Background}');
  min-height: 100vh;
`;

export const Banner = styled.div`
  background: url('${Texture}');
  background-color: #1f1f1f;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  height: 180px;

  img {
    height: 130px;
  }

  @media (max-width: 768px) {
    height: 120px;

    img {
      height: 80px;
    }
  }
`;

export const Title = styled.div`
  font-size: 32px;
  font-weight: 800;
  padding-bottom: 12px;
  color: #61a120;
  text-align: center;
  position: relative;

  &::after {
    position: absolute;
    left: calc(50% + -28px);
    bottom: 0;
    content: '';
    width: 56px;
    height: 4px;
    background-color: #61a120;
  }
`;

export const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 35%;
  gap: 40px;
  width: 100%;
  max-width: 1280px;
  padding: 40px;
  margin: 0 auto;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 20px;
  }
`;
