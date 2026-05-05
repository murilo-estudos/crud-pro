import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Layout, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
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
    <nav style={{...navStyle, backgroundColor: 'var(--nav-bg)'}}>
      <div style={containerStyle}>
        <div style={logoStyle}>
          <Layout size={24} color="#007bff" />
          <span className="brand-name">CRUD Pro</span>
        </div>

        <div style={userActionsStyle}>
          {/* BOTÃO DE DARK MODE */}
          <button onClick={toggleTheme} style={themeButtonStyle}>
            {isDarkMode ? <Sun size={20} color="#ffcc00" /> : <Moon size={20} color="#666" />}
          </button>

          {currentUser && (
            <>
              <span className="user-email">{currentUser.email}</span>
              <button onClick={handleLogout} style={logoutButtonStyle}>
                <LogOut size={18} />
                <span className="hide-mobile">Sair</span>
              </button>
            </>
          )}
        </div>
      </div>

      <style>{`
        .brand-name { font-weight: bold; font-size: 20px; color: #007bff; }
        .user-email { color: var(--text-color); font-size: 14px; }
        
        @media (max-width: 600px) {
          .user-email { display: none; }
          .hide-mobile { display: none; }
        }
      `}</style>
    </nav>
  );
};

// Estilos

const themeButtonStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  padding: '8px',
  borderRadius: '50%',
  transition: '0.2s',
  backgroundColor: 'rgba(0,0,0,0.05)'
};

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