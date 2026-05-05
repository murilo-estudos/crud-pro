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
      navigate('/'); // Manda o usuário para o Dashboard (Home)
    } catch (error) {
      console.error(error);
      // Tratamento de erro básico para o usuário
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
      <Toaster />
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={{ textAlign: 'center' }}>Acessar App</h2>
        
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

        <p style={{ fontSize: '14px', textAlign: 'center' }}>
          Novo por aqui? <Link to="/register">Crie uma conta</Link>
        </p>
      </form>
    </div>
  );
};

// Reutilizando os mesmos estilos por enquanto
const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', fontFamily: 'Roboto, sans-serif' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', padding: '30px', border: '1px solid #ddd', borderRadius: '12px', width: '320px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  input: { padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '16px' },
  button: { padding: '12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }
};

export default Login;