import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      await login(email, password);
      toast.success('Login realizado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/invalid-credential') {
        toast.error('E-mail ou senha incorretos.');
      } else {
        toast.error('Erro ao acessar a conta.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      {/* O Toaster agora usa as configurações que fizemos para o Dark Mode */}
      <Toaster 
        toastOptions={{
          style: {
            background: 'var(--card-bg)',
            color: 'var(--text-color)',
            border: '1px solid rgba(128, 128, 128, 0.2)',
          }
        }} 
      />
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={{ textAlign: 'center', color: 'var(--text-color)' }}>Acessar App</h2>
        
        <input 
          type="email" 
          placeholder="E-mail" 
          required 
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input 
          type="password" 
          placeholder="Senha" 
          required 
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button disabled={loading} type="submit" style={styles.button}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <p style={{ fontSize: '14px', textAlign: 'center', color: 'var(--text-color)' }}>
          Novo por aqui? <Link to="/register" style={{ color: '#007bff' }}>Crie uma conta</Link>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '80vh', 
    fontFamily: 'Roboto, sans-serif',
    backgroundColor: 'var(--bg-color)' // Fundo da tela adaptável
  },
  form: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '15px', 
    padding: '30px', 
    backgroundColor: 'var(--card-bg)', // Fundo do card adaptável
    border: '1px solid rgba(128, 128, 128, 0.2)', // Borda sutil
    borderRadius: '12px', 
    width: '320px', 
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)' 
  },
  input: { 
    padding: '12px', 
    borderRadius: '6px', 
    border: '1px solid rgba(128, 128, 128, 0.3)', 
    fontSize: '16px',
    backgroundColor: 'var(--bg-color)', // Input escurece no dark mode
    color: 'var(--text-color)'           // Texto do input fica claro
  },
  button: { 
    padding: '12px', 
    backgroundColor: '#28a745', 
    color: '#fff', 
    border: 'none', 
    borderRadius: '6px', 
    cursor: 'pointer', 
    fontWeight: 'bold', 
    fontSize: '16px',
    transition: '0.3s'
  }
};

export default Login;