import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Layout } from 'lucide-react';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch {
      console.log("Erro ao sair");
    }
  }

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        <div style={logoStyle}>
          <Layout size={24} color="#007bff" />
          <span className="brand-name">CRUD Pro</span>
        </div>

        {currentUser && (
          <div style={userActionsStyle}>
            <span className="user-email">{currentUser.email}</span>
            <button onClick={handleLogout} style={logoutButtonStyle}>
              <LogOut size={18} />
              <span>Sair</span>
            </button>
          </div>
        )}
      </div>

      <style>{`
        .brand-name { font-weight: bold; font-size: 20px; color: #007bff; }
        .user-email { color: #666; font-size: 14px; }
        
        @media (max-width: 480px) {
          .user-email { display: none; } /* Esconde o email em celulares muito pequenos */
          .brand-name { font-size: 16px; }
        }
      `}</style>
    </nav>
  );
};

// Estilos
const navStyle = {
  backgroundColor: 'white',
  padding: '10px 20px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  marginBottom: '20px'
};

const containerStyle = { 
  width: '100%',      
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const logoStyle = { display: 'flex', alignItems: 'center', gap: '10px' };

const userActionsStyle = { display: 'flex', alignItems: 'center', gap: '15px' };

const logoutButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: '#ff4d4d',
  color: 'white',
  border: 'none',
  padding: '8px 15px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '500'
};

export default Navbar;