import { useContext, createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext({});

function lerCarrinhoSalvo() {
  try {
    const salvo = localStorage.getItem('devburger:cartInfo');

    return salvo ? JSON.parse(salvo) : [];
  } catch (error) {
    console.error('Carrinho invalido no localStorage:', error);

    return [];
  }
}

export const CartProvider = ({ children }) => {
  const [cartProducts, setCartProducts] = useState(() => lerCarrinhoSalvo());

  useEffect(() => {
    localStorage.setItem('devburger:cartInfo', JSON.stringify(cartProducts));
  }, [cartProducts]);

  const putProductInCart = (product) => {
    setCartProducts((prev) => {
      const isInCart = prev.some((prd) => prd.id === product.id);

      return isInCart
        ? prev.map((prd) =>
            prd.id === product.id
              ? { ...prd, quantity: prd.quantity + 1 }
              : prd,
          )
        : [...prev, { ...product, quantity: 1 }];
    });

    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  const clearCart = () => {
    setCartProducts([]);
  };

  const deleteProduct = (productId) => {
    setCartProducts((prev) => prev.filter((prd) => prd.id !== productId));
  };

  const increaseProduct = (productId) => {
    setCartProducts((prev) =>
      prev.map((prd) =>
        prd.id === productId ? { ...prd, quantity: prd.quantity + 1 } : prd,
      ),
    );
  };

  const decreaseProduct = (productId) => {
    setCartProducts((prev) =>
      prev
        .map((prd) =>
          prd.id === productId ? { ...prd, quantity: prd.quantity - 1 } : prd,
        )
        .filter((prd) => prd.quantity > 0),
    );
  };

  const cartQuantity = cartProducts.reduce(
    (total, product) => total + product.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartProducts,
        cartQuantity,
        putProductInCart,
        clearCart,
        decreaseProduct,
        increaseProduct,
        deleteProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used with a context');
  }

  return context;
};
