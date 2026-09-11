import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { CardProduct } from '../../components/CardProduct';
import { api } from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';
import {
  Container,
  Banner,
  CategoryMenu,
  ProductsContainer,
  CategoryButton,
} from './styles';

export function Menu() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const { search } = useLocation();

  const queryParams = new URLSearchParams(search);

  const [activeCategory, setActiveCategory] = useState(() => {
    const categoryId = +queryParams.get('categoria');

    if (categoryId) {
      return categoryId;
    }
    return 0;
  });

  useEffect(() => {
    async function loadCategories() {
      const { data } = await api.get('/categories');
      const newCategories = [{ id: 0, name: 'Todas' }, ...data];
      setCategories(newCategories);
    }

    async function loadProducts() {
      const { data } = await api.get('/products');

      const newProducts = data.map((product) => ({
        ...product,
        currencyValue: formatPrice(product.price),
      }));

      setProducts(newProducts);
    }

    loadCategories();
    loadProducts();
  }, []);

  const filteredProducts =
    activeCategory === 0
      ? products
      : products.filter((product) => product.category_id === activeCategory);

  return (
    <Container>
      <Banner>
        <h1>
          O MELHOR
          <br />
          HAMBÚRGUER
          <br />
          ESTÁ AQUI
          <span>Esse cardápio está irresistível!</span>
        </h1>
      </Banner>
      <CategoryMenu>
        {categories.map((category) => (
          <CategoryButton
            key={category.id}
            to={`/cardapio?categoria=${category.id}`}
            replace
            $isActiveCategory={category.id === activeCategory}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </CategoryButton>
        ))}
      </CategoryMenu>

      <ProductsContainer>
        {filteredProducts.map((product) => (
          <CardProduct product={product} key={product.id} />
        ))}
      </ProductsContainer>
    </Container>
  );
}
