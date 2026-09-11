import styled from 'styled-components';

export const Container = styled.div`
  .carousel-item {
    padding-right: 40px;
  }
  overflow-x: hidden;

  .react-multi-carousel-list {
    padding-top: 60px;
    margin-top: -60px;
  }

  .react-multiple-carousel__arrow--left {
    left: 15px;
    top: 10px;
  }

  .react-multiple-carousel__arrow--right {
    top: 10px;
  }

  padding-left: 40px;

  @media (max-width: 768px) {
    padding-left: 16px;

    .carousel-item {
      padding-right: 16px;
    }
  }
  padding-bottom: 40px;
`;

export const Title = styled.h2`
  font-size: clamp(22px, 4vw, 32px);
  color: #61a120;
  font-weight: 800;
  padding-bottom: 12px;
  position: relative;
  text-align: center;
  margin-bottom: 40px;

  &::after {
    content: '';
    bottom: 0;
    position: absolute;
    width: 56px;
    height: 4px;
    background-color: #61a120;
    left: calc(50% - 28px);
  }
`;
