import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// 1. Cria o Contexto
const AuthContext = createContext();

// 2. Função gancho (hook) para usarmos o contexto facilmente
export function useAuth() {
  return useContext(AuthContext);
}

// 3. O Provedor que vai envolver nosso App
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função para Cadastro
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // Função para Login
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Função para Logout
  function logout() {
    return signOut(auth);
  }

  // Efeito que monitora o estado do login no Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false); // Quando o Firebase responde, paramos de carregar
    });

    return unsubscribe;
  }, []);

  // O que o contexto vai "exportar" para os outros arquivos
  const value = {
    currentUser,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}