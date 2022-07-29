import React, { createContext, useEffect, useReducer } from 'react';
import { onAuthStateChangedListener } from '../firebase/config';

export const AuthContext = createContext({
  user: null,
  authIsReady: false,
});

export const authReducer = (state, Action) => {
  const { type, payload } = Action;
  switch (type) {
    case 'LOGIN':
      return { ...state, user: payload };

    case 'LOGOUT':
      return { ...state, user: null };

    case 'AUTH_IS_READY':
      return { ...state, user: payload, authIsReady: true };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    authIsReady: false,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      dispatch({ type: 'AUTH_IS_READY', payload: user });
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
