import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Discover from './pages/Discover';
import Profile from './pages/Profile';
import Watchlist from './pages/Watchlist';
import MovieDetail from './pages/MovieDetail';
import Friends from './pages/Friends';

// Components
import Layout from './components/Layout';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/discover" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/discover" />} />
        
        {/* Protected routes */}
        <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Navigate to="/discover" />} />
          <Route path="discover" element={<Discover />} />
          <Route path="profile" element={<Profile />} />
          <Route path="watchlist" element={<Watchlist />} />
          <Route path="movie/:id" element={<MovieDetail />} />
          <Route path="friends" element={<Friends />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;