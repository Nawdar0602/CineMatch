import React from 'react';
import { motion } from 'framer-motion';
import { Friend } from '../stores/friendStore';

type FriendCardProps = {
  friend: Friend;
  isPending?: boolean;
  isSent?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
  onRemove?: () => void;
  onViewProfile?: () => void;
  onCancel?: () => void;
};

const FriendCard: React.FC<FriendCardProps> = ({ 
  friend, 
  isPending = false, 
  isSent,
  onViewProfile, 
  onAccept, 
  onReject, 
  onRemove,
  onCancel
}) => {
  return (
    <motion.div 
      className="bg-card rounded-xl p-4 shadow-md flex items-center justify-between"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center">
        <img 
          src={friend.profilePicture} 
          alt={friend.username} 
          className="w-12 h-12 rounded-full object-cover border-2 border-accent"
        />
        <div className="ml-3">
          <h3 className="font-bold text-text">{friend.username}</h3>
          {friend.compatibilityScore && !isPending && !isSent && (
            <p className="text-sm text-text opacity-70">
              <span className="text-accent">{friend.compatibilityScore}%</span> match
            </p>
          )}
          {isSent && (
            <p className="text-sm text-accent">Verzoek verzonden</p>
          )}
        </div>
      </div>
      
      <div className="flex space-x-2">
        {isPending ? (
          <>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="bg-accent text-white px-3 py-1 rounded-full text-sm font-medium"
              onClick={onAccept}
            >
              Accepteren
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="bg-white bg-opacity-10 text-text px-3 py-1 rounded-full text-sm font-medium"
              onClick={onReject}
            >
              Afwijzen
            </motion.button>
          </>
        ) : isSent ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="bg-white bg-opacity-10 text-text px-3 py-1 rounded-full text-sm font-medium"
            onClick={onCancel}
          >
            Annuleren
          </motion.button>
        ) : (
          <>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="bg-white bg-opacity-10 text-text px-3 py-1 rounded-full text-sm font-medium"
              onClick={onViewProfile}
            >
              Profiel
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium"
              onClick={onRemove}
            >
              Verwijderen
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default FriendCard;