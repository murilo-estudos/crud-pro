import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <h1 style={{ fontSize: '72px', color: '#007bff', margin: 0 }}>404</h1>
      <h2>Opa! Página não encontrada.</h2>
      <p>Parece que você tentou acessar um caminho que não existe.</p>
      <button 
        onClick={() => navigate('/')}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Voltar para o Início
      </button>
    </div>
  );
};

export default NotFound;