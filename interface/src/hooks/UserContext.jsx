import { createContext, useContext, useState } from 'react';

const UserContext = createContext({});

function lerUsuarioSalvo() {
  try {
    const salvo = localStorage.getItem('devburger:userData');

    return salvo ? JSON.parse(salvo) : {};
  } catch (error) {
    console.error('Dados de usuario invalidos no localStorage:', error);

    return {};
  }
}

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(() => lerUsuarioSalvo());

  const putUserData = (userInfo) => {
    setUserInfo(userInfo);

    localStorage.setItem('devburger:userData', JSON.stringify(userInfo));
  };

  const logout = () => {
    setUserInfo({});
    localStorage.removeItem('devburger:userData');
  };

  return (
    <UserContext.Provider value={{ userInfo, putUserData, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be a valid context');
  }

  return context;
};
