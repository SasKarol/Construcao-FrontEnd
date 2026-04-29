import React, { createContext, useReducer } from 'react';

// Criando o contexto
export const AuthContext = createContext();

// Estado inicial: usuário não está logado
const initialState = {
  isAuthenticated: false,
  user: null,
};

// Reducer com ações simples, simulando o taskReducer
function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { isAuthenticated: true, user: action.payload };
    case 'LOGOUT':
      return { isAuthenticated: false, user: null };
    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Função de login simulada (usuário e senha mockados)
  const login = (username, password) => {
    // Valores fixos no front-end: admin / 1234
    if (username === 'admin' && password === '1234') {
      dispatch({ type: 'LOGIN', payload: username });
      return true;
    }
    return false;
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};