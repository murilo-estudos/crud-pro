import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      await signup(email, password);
      toast.success('Conta criada com sucesso!');
      navigate('/'); 
    } catch (error) {
      console.error(error);
      toast.error('Falha ao criar conta: ' + error.message);
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
          placeholder="Seu melhor E-mail" 
          required 
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input 
          type="password" 
          placeholder="Sua senha (mín. 6 caracteres)" 
          required 
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button disabled={loading} type="submit" style={styles.button}>
          {loading ? 'Carregando...' : 'Cadastrar'}
        </button>

        <p style={{ fontSize: '14px', textAlign: 'center', color: 'var(--text-color)' }}>
          Já tem conta? <Link to="/login" style={{ color: '#007bff' }}>Faça Login</Link>
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
    backgroundColor: '#007bff', 
    color: '#fff', 
    border: 'none', 
    borderRadius: '6px', 
    cursor: 'pointer', 
    fontWeight: 'bold', 
    fontSize: '16px',
    transition: '0.3s'
  }
};

export default Register;