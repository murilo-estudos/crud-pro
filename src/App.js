import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css';

// Importação das Páginas
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Importação de Componentes
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import NotFound from './pages/NotFound';


function App() {
  return (
    <ThemeProvider>
      <Router>
          <AuthProvider>
            <Navbar /> 
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
      </Router>
    </ThemeProvider>         
  );
}

export default App;