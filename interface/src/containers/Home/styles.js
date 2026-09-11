import styled from 'styled-components';

import Background from '../../assets/background.svg';
import BannerHome from '../../assets/banner-home.svg';

export const Banner = styled.div`
  background: url('${BannerHome}');
  background-size: cover;
  background-position: center;
  height: 480px;

  @media (max-width: 768px) {
    height: 260px;
  }

  position: relative;

  h1 {
    font-family: 'Road Rage', sans-serif;
    font-size: clamp(32px, 7vw, 80px);
    color: #f4f4f4;
    position: absolute;
    right: 20%;
    top: 10%;

    @media (max-width: 768px) {
      position: static;
      right: auto;
      top: auto;
      text-align: center;
      padding: 24px 16px 0;
    }
  }
`;

export const Container = styled.section`
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)),
    url(${Background});
  background-size: cover;
  background-position: center;
  background-repeat: repeat;
  min-height: 100vh;
  width: 100%;
`;
