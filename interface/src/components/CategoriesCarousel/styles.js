import { Link } from 'react-router-dom';

import styled from 'styled-components';

export const Container = styled.div`
  .carousel-item {
    padding-right: 40px;
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
  padding-bottom: 80px;
`;

export const Title = styled.h2`
  font-size: clamp(22px, 4vw, 32px);
  color: ${(props) => props.theme.purple};
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
    background-color: ${(props) => props.theme.purple};
    left: calc(50% - 28px);
  }
`;

export const ContainerItems = styled.div`
  background: url('${(props) => props.$imageUrl}');
  background-position: center;
  background-size: cover;
  border-radius: 20px;

  display: flex;
  align-items: center;
  padding: 20px 10px;
  width: 100%;
  height: 250px;
`;

export const CategoryButton = styled(Link)`
  color: #ffffff;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 30px;
  border-radius: 30px;
  font-size: 22.5px;
  margin-top: 50px;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 15px;
    padding: 8px 16px;
  }

  &:hover {
    background-color: ${(props) => props.theme.purple};
  }
`;
