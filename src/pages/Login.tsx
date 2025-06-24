import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { login } from '../services/authService';
import { useAuthStore } from '../stores/authStore';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login: loginUser } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Validatie
      if (!email || !password) {
        throw new Error('Vul alle velden in');
      }
      
      // Login aanroepen
      const response = await login({ email, password });
      
      // Gebruiker inloggen in de store
      loginUser(response.user, response.token);
      
      // Navigeren naar discover pagina
      navigate('/discover');
    } catch (err: any) {
      setError(err.message || 'Er is iets misgegaan bij het inloggen');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-accent mb-2">CineMatch</h1>
          <p className="text-text opacity-80">Ontdek films met je vrienden</p>
        </div>
        
        <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-text mb-6">Inloggen</h2>
          
          {error && (
            <div className="bg-red-500 bg-opacity-20 text-red-300 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-text opacity-80 mb-1">E-mailadres</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="jouw@email.nl"
                disabled={isLoading}
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-text opacity-80 mb-1">Wachtwoord</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-accent text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Bezig met inloggen...' : 'Inloggen'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-text opacity-70">
              Nog geen account?{' '}
              <Link to="/register" className="text-accent hover:underline">
                Registreer hier
              </Link>
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center text-text opacity-50 text-sm">
          <p>Gebruik voor demo: test@example.com / password123</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;