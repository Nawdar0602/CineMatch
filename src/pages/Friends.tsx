import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFriendStore } from '../stores/friendStore';
import { 
  getFriends, 
  getPendingRequests, 
  getSentRequests,
  getMatches, 
  acceptFriendRequest, 
  rejectFriendRequest, 
  removeFriend,
  sendFriendRequest
} from '../services/friendService';
import FriendCard from '../components/FriendCard';
import MatchCard from '../components/MatchCard';
import { useToast } from '../hooks/useToast';

const Friends: React.FC = () => {
  const { 
    friends, setFriends,
    pendingRequests, setPendingRequests,
    sentRequests, setSentRequests,
    matches, setMatches,
    loading: isLoading, setLoading, 
    error, setError 
  } = useFriendStore();
  
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'sent' | 'matches'>('friends');
  const [username, setUsername] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [friendsData, requestsData, sentRequestsData, matchesData] = await Promise.all([
          getFriends(),
          getPendingRequests(),
          getSentRequests(),
          getMatches()
        ]);
        
        setFriends(friendsData);
        setPendingRequests(requestsData);
        setSentRequests(sentRequestsData);
        setMatches(matchesData);
      } catch (err: any) {
        setError(err.message || 'Er is iets misgegaan bij het laden van vrienden');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [setFriends, setPendingRequests, setMatches, setLoading, setError]);
  
  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    try {
      await sendFriendRequest(username);
      // Refresh sent requests
      const updatedSentRequests = await getSentRequests();
      setSentRequests(updatedSentRequests);
      setUsername('');
      setRequestSent(true);
      setTimeout(() => setRequestSent(false), 3000);
      showToast('Vriendschapsverzoek verzonden!', 'success');
      setActiveTab('sent');
    } catch (err: any) {
      showToast(err.message || 'Er is iets misgegaan', 'error');
    }
  };
  
  const handleAcceptRequest = async (requestId: string) => {
    try {
      await acceptFriendRequest(requestId);
      // Refresh friends and pending requests
      const [updatedFriends, updatedRequests] = await Promise.all([
        getFriends(),
        getPendingRequests()
      ]);
      setFriends(updatedFriends);
      setPendingRequests(updatedRequests);
      showToast('Vriendschapsverzoek geaccepteerd!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Er is iets misgegaan', 'error');
    }
  };
  
  const handleRejectRequest = async (requestId: string) => {
    try {
      await rejectFriendRequest(requestId);
      // Refresh pending requests
      const updatedRequests = await getPendingRequests();
      setPendingRequests(updatedRequests);
      showToast('Vriendschapsverzoek afgewezen', 'info');
    } catch (err: any) {
      showToast(err.message || 'Er is iets misgegaan', 'error');
    }
  };
  
  const handleRemoveFriend = async (friendId: string) => {
    try {
      await removeFriend(friendId);
      // Refresh friends and matches
      const [updatedFriends, updatedMatches] = await Promise.all([
        getFriends(),
        getMatches()
      ]);
      setFriends(updatedFriends);
      setMatches(updatedMatches);
      showToast('Vriend verwijderd', 'info');
    } catch (err: any) {
      showToast(err.message || 'Er is iets misgegaan', 'error');
    }
  };
  
  const handleCancelRequest = async (requestId: string) => {
    try {
      // We can reuse the reject function for canceling sent requests
      await rejectFriendRequest(requestId);
      // Refresh sent requests
      const updatedSentRequests = await getSentRequests();
      setSentRequests(updatedSentRequests);
      showToast('Vriendschapsverzoek geannuleerd', 'info');
    } catch (err: any) {
      showToast(err.message || 'Er is iets misgegaan', 'error');
    }
  };
  
  const handleViewProfile = (friendId: string) => {
    navigate(`/profile/${friendId}`);
  };
  
  const handleViewMovie = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };
  
  const handleAddToWatchlist = (movieId: number) => {
    // Add to watchlist logic
    showToast('Film toegevoegd aan watchlist!', 'success');
  };
  
  const handleChat = (friendId: string) => {
    // Open chat logic
    showToast('Chat functie komt binnenkort!', 'info');
  };
  
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text mb-4">Vrienden</h1>
        
        {/* Tabs */}
        <div className="flex overflow-x-auto space-x-2 pb-2">
          <button
            onClick={() => setActiveTab('friends')}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${activeTab === 'friends' ? 'bg-accent text-white' : 'bg-white bg-opacity-10 text-text'}`}
          >
            Vrienden
            {friends.length > 0 && (
              <span className="ml-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded-full">
                {friends.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${activeTab === 'requests' ? 'bg-accent text-white' : 'bg-white bg-opacity-10 text-text'}`}
          >
            Ontvangen
            {pendingRequests.length > 0 && (
              <span className="ml-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded-full">
                {pendingRequests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${activeTab === 'sent' ? 'bg-accent text-white' : 'bg-white bg-opacity-10 text-text'}`}
          >
            Verzonden
            {sentRequests.length > 0 && (
              <span className="ml-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded-full">
                {sentRequests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${activeTab === 'matches' ? 'bg-accent text-white' : 'bg-white bg-opacity-10 text-text'}`}
          >
            Matches
            {matches.length > 0 && (
              <span className="ml-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded-full">
                {matches.length}
              </span>
            )}
          </button>
        </div>
      </div>
      
      {/* Vriend toevoegen */}
      {activeTab === 'friends' && (
        <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-xl p-4 mb-6">
          <h2 className="text-lg font-bold text-text mb-3">Vriend toevoegen</h2>
          <div className="flex">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Gebruikersnaam"
              className="flex-1 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-l-lg px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              onClick={handleSendRequest}
              className="bg-accent text-white font-bold py-2 px-4 rounded-r-lg hover:bg-opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
            >
              Versturen
            </button>
          </div>
          {requestSent && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-green-400 text-sm mt-2"
            >
              Vriendschapsverzoek verstuurd!
            </motion.p>
          )}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-text">Laden...</p>
        </div>
      ) : error ? (
        <div className="bg-red-500 bg-opacity-20 text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : activeTab === 'friends' && friends.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[30vh] text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-text opacity-50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h3 className="text-xl font-bold text-text mb-2">Nog geen vrienden</h3>
          <p className="text-text opacity-70">Voeg vrienden toe om samen films te ontdekken</p>
        </div>
      ) : activeTab === 'requests' && pendingRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[30vh] text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-text opacity-50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 className="text-xl font-bold text-text mb-2">Geen verzoeken</h3>
          <p className="text-text opacity-70">Je hebt momenteel geen ontvangen vriendschapsverzoeken</p>
        </div>
      ) : activeTab === 'sent' && sentRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[30vh] text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-text opacity-50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          <h3 className="text-xl font-bold text-text mb-2">Geen verzonden verzoeken</h3>
          <p className="text-text opacity-70">Je hebt momenteel geen verzonden vriendschapsverzoeken</p>
        </div>
      ) : activeTab === 'matches' && matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[30vh] text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-text opacity-50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 className="text-xl font-bold text-text mb-2">Nog geen matches</h3>
          <p className="text-text opacity-70">Swipe op meer films om matches te vinden met vrienden</p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="space-y-4"
        >
          {activeTab === 'friends' && friends.map((friend) => (
            <FriendCard 
              key={friend.id} 
              friend={friend} 
              onViewProfile={() => handleViewProfile(friend.id)}
              onRemove={() => handleRemoveFriend(friend.id)}
            />
          ))}
          
          {activeTab === 'requests' && pendingRequests.map((request) => (
            <FriendCard 
              key={request.id} 
              friend={request} 
              isPending={true}
              onAccept={() => handleAcceptRequest(request.id)}
              onReject={() => handleRejectRequest(request.id)}
              onViewProfile={() => handleViewProfile(request.id)}
            />
          ))}
          
          {activeTab === 'sent' && sentRequests.map((request) => (
            <FriendCard 
              key={request.id} 
              friend={request} 
              isSent={true}
              onCancel={() => handleCancelRequest(request.id)}
              onViewProfile={() => handleViewProfile(request.id)}
            />
          ))}
          
          {activeTab === 'matches' && matches.map((match) => (
            <MatchCard 
              key={`${match.friend.id}-${match.movie.id}`} 
              match={match} 
              onViewMovie={handleViewMovie}
              onViewFriend={() => handleViewProfile(match.friend.id)}
              onAddToWatchlist={handleAddToWatchlist}
              onChat={() => handleChat(match.friend.id)}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Friends;