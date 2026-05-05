import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast'; // Notificações bonitas

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
      navigate('/'); // Manda para o Dashboard
    } catch (error) {
      console.error(error);
      toast.error('Falha ao criar conta: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <Toaster /> {/* Componente que mostra o balão de alerta */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Criar Conta</h2>
        
        <input 
          type="email" 
          placeholder="Seu melhor e-mail" 
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

        <p>
          Já tem conta? <Link to="/login">Faça Login</Link>
        </p>
      </form>
    </div>
  );
};

// Estilização básica rápida (nível produção usaria CSS separado ou Tailwind)
const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', padding: '30px', border: '1px solid #ddd', borderRadius: '8px', width: '300px' },
  input: { padding: '10px', borderRadius: '4px', border: '1px solid #ccc' },
  button: { padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default Register;