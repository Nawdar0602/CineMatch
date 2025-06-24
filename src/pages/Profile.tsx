import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { updateProfile } from '../services/authService';
import { useFriendStore } from '../stores/friendStore';
import { useMovieStore } from '../stores/movieStore';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const { friends } = useFriendStore();
  const { likedMovies, superLikedMovies } = useMovieStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Reset form when user changes
  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
      setBio(user.bio || '');
    }
  }, [user]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);
    
    try {
      if (!username.trim()) {
        throw new Error('Gebruikersnaam is verplicht');
      }
      
      if (!email.trim()) {
        throw new Error('E-mailadres is verplicht');
      }
      
      if (!user) {
        throw new Error('Gebruiker niet gevonden');
      }
      
      // Update profiel
      const updatedUser = await updateProfile(user.id, {
        username,
        email,
        bio
      });
      
      // Update user in store
      updateUser(updatedUser);
      
      setSuccess(true);
      setIsEditing(false);
      
      // Reset success message na 3 seconden
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Er is iets misgegaan bij het bijwerken van je profiel');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Bereken statistieken
  const totalLikes = likedMovies.length + superLikedMovies.length;
  const superLikePercentage = totalLikes > 0 ? Math.round((superLikedMovies.length / totalLikes) * 100) : 0;
  
  // Bepaal badges (in een echte app zou dit complexer zijn)
  const badges = [];
  if (totalLikes > 50) badges.push('Film Liefhebber');
  if (superLikedMovies.length > 10) badges.push('Super Fan');
  if (friends.length > 5) badges.push('Sociaal');
  
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text mb-2">Mijn Profiel</h1>
      </div>
      
      {!user ? (
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <p className="text-text">Je moet ingelogd zijn om je profiel te bekijken</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Profiel header */}
          <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-6 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center text-white text-3xl font-bold mb-4">
              {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </div>
            
            <h2 className="text-xl font-bold text-text">{user.username}</h2>
            <p className="text-text opacity-70">{user.email}</p>
            
            {!isEditing && user.bio && (
              <p className="text-text mt-4 text-center">{user.bio}</p>
            )}
            
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 bg-white bg-opacity-10 text-text px-4 py-2 rounded-lg hover:bg-opacity-20 transition-all"
              >
                Profiel bewerken
              </button>
            )}
          </div>
          
          {/* Formulier voor bewerken */}
          {isEditing && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-6"
            >
              <h2 className="text-xl font-bold text-text mb-4">Profiel bewerken</h2>
              
              {error && (
                <div className="bg-red-500 bg-opacity-20 text-red-300 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-500 bg-opacity-20 text-green-300 px-4 py-3 rounded-lg mb-4">
                  Profiel succesvol bijgewerkt!
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="username" className="block text-text opacity-80 mb-1">Gebruikersnaam</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-accent"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-text opacity-80 mb-1">E-mailadres</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-accent"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="bio" className="block text-text opacity-80 mb-1">Bio</label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-accent"
                    rows={4}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Bezig met opslaan...' : 'Opslaan'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-white bg-opacity-10 text-text px-4 py-2 rounded-lg hover:bg-opacity-20 transition-all"
                    disabled={isLoading}
                  >
                    Annuleren
                  </button>
                </div>
              </form>
            </motion.div>
          )}
          
          {/* Statistieken */}
          <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-bold text-text mb-4">Statistieken</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-accent">{totalLikes}</p>
                <p className="text-text opacity-70">Films geliked</p>
              </div>
              
              <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-accent">{superLikedMovies.length}</p>
                <p className="text-text opacity-70">Super likes</p>
              </div>
              
              <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-accent">{friends.length}</p>
                <p className="text-text opacity-70">Vrienden</p>
              </div>
              
              <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-accent">{superLikePercentage}%</p>
                <p className="text-text opacity-70">Super like ratio</p>
              </div>
            </div>
          </div>
          
          {/* Badges */}
          {badges.length > 0 && (
            <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-xl font-bold text-text mb-4">Badges</h2>
              
              <div className="flex flex-wrap gap-2">
                {badges.map((badge, index) => (
                  <div 
                    key={index}
                    className="bg-accent bg-opacity-20 text-accent px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;