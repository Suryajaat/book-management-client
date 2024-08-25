import React, { createContext, useReducer } from 'react';

const initialState = { isAuthenticated: false, user: null, token: null };

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return { ...state, isAuthenticated: true, token: action.payload.token, user: action.payload.user };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return { ...state, isAuthenticated: false, token: null, user: null };
    default:
      return state;
  }
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
