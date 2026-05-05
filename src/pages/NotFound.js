import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  

  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '100px 20px',
      // Adicionando cores dinâmicas para o fundo e texto da página toda
      backgroundColor: 'var(--bg-color)', 
      color: 'var(--text-color)',
      minHeight: '100vh' 
    }}>
      <h1 style={{ fontSize: '72px', color: '#007bff', margin: 0 }}>404</h1>
      <h2>Opa! Página não encontrada.</h2>
      <p>Parece que você tentou acessar um caminho que não existe.</p>
      <button 
        onClick={() => navigate('/')}
        style={{
          padding: '10px 20px',
          // O botão usa as cores inversas ou cores de destaque
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