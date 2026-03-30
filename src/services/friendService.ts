import { Friend, Match } from '../stores/friendStore';

// Database connectie en types zullen worden gebruikt in plaats van mock data
const MOCK_FRIENDS: Friend[] = [];
const MOCK_PENDING_REQUESTS: Friend[] = [];
const MOCK_SENT_REQUESTS: Friend[] = [];

// MySQL database connectie (moet worden geïmplementeerd)
// In een echte applicatie zou je hier een database connectie maken
// Bijvoorbeeld met mysql2 of een andere MySQL client


const MOCK_MATCHES: Match[] = [];

// Matches zullen worden opgehaald uit de database in plaats van hardcoded te zijn

// Simuleer een API call met een timeout
const simulateApiCall = <T>(data: T, delay = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// Friend services
export const getFriends = async (): Promise<Friend[]> => {
  try {
    // In een echte app zou je hier een MySQL query uitvoeren
    // Bijvoorbeeld:
    // const connection = await getConnection();
    // const [rows] = await connection.execute(
    //   `SELECT f.friend_id as id, u.username, u.profile_picture as profilePicture, f.compatibility_score as compatibilityScore
    //    FROM friends f
    //    JOIN users u ON f.friend_id = u.id
    //    WHERE f.user_id = ?
    //    ORDER BY u.username`,
    //   [getCurrentUserId()] // Functie om de huidige ingelogde gebruiker op te halen
    // );
    // return rows;
    
    // Voor nu gebruiken we nog steeds de mock data
    return simulateApiCall(MOCK_FRIENDS);
  } catch (error) {
    console.error('Error fetching friends:', error);
    throw error;
  }
};

export const getPendingRequests = async (): Promise<Friend[]> => {
  try {
    // In een echte app zou je hier een MySQL query uitvoeren
    // Bijvoorbeeld:
    // const connection = await getConnection();
    // const [rows] = await connection.execute(
    //   `SELECT fr.sender_id as id, u.username, u.profile_picture as profilePicture
    //    FROM friend_requests fr
    //    JOIN users u ON fr.sender_id = u.id
    //    WHERE fr.receiver_id = ? AND fr.status = 'pending'
    //    ORDER BY fr.created_at DESC`,
    //   [getCurrentUserId()]
    // );
    // return rows;
    
    // Voor nu gebruiken we nog steeds de mock data
    return simulateApiCall(MOCK_PENDING_REQUESTS);
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    throw error;
  }
};

export const getMatches = async (): Promise<Match[]> => {
  try {
    // In een echte app zou je hier een MySQL query uitvoeren
    // Bijvoorbeeld:
    // const connection = await getConnection();
    // const [rows] = await connection.execute(
    //   `SELECT m.id, m.friend_id as friendId, m.movie_id as movieId, m.created_at as createdAt,
    //          u.id as 'friend.id', u.username as 'friend.username', u.profile_picture as 'friend.profilePicture',
    //          f.compatibility_score as 'friend.compatibilityScore',
    //          mv.id as 'movie.id', mv.title as 'movie.title', mv.poster_path as 'movie.poster_path',
    //          mv.backdrop_path as 'movie.backdrop_path', mv.overview as 'movie.overview',
    //          mv.release_date as 'movie.release_date', mv.vote_average as 'movie.vote_average'
    //    FROM matches m
    //    JOIN users u ON m.friend_id = u.id
    //    JOIN friends f ON (m.user_id = f.user_id AND m.friend_id = f.friend_id)
    //    JOIN movies mv ON m.movie_id = mv.id
    //    WHERE m.user_id = ?
    //    ORDER BY m.created_at DESC`,
    //   [getCurrentUserId()]
    // );
    // 
    // // Verwerk de resultaten om de geneste objecten correct te formatteren
    // const matches = rows.map(row => {
    //   const match = {
    //     id: row.id,
    //     friendId: row.friendId,
    //     movieId: row.movieId,
    //     createdAt: row.createdAt,
    //     friend: {
    //       id: row['friend.id'],
    //       username: row['friend.username'],
    //       profilePicture: row['friend.profilePicture'],
    //       compatibilityScore: row['friend.compatibilityScore']
    //     },
    //     movie: {
    //       id: row['movie.id'],
    //       title: row['movie.title'],
    //       poster_path: row['movie.poster_path'],
    //       backdrop_path: row['movie.backdrop_path'],
    //       overview: row['movie.overview'],
    //       release_date: row['movie.release_date'],
    //       vote_average: row['movie.vote_average'],
    //       genres: [] // Genres zouden in een aparte query opgehaald moeten worden
    //     }
    //   };
    //   return match;
    // });
    // 
    // return matches;
    
    // Voor nu gebruiken we nog steeds de mock data
    return simulateApiCall(MOCK_MATCHES);
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }
};

// Functie om een uniek ID te genereren
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const sendFriendRequest = async (username: string): Promise<{ success: boolean }> => {
  try {
    // In een echte app zou je hier een MySQL query uitvoeren
    // Bijvoorbeeld:
    // const connection = await getConnection();
    // const userId = getCurrentUserId();
    // 
    // // Controleer eerst of de gebruiker bestaat
    // const [users] = await connection.execute(
    //   `SELECT id FROM users WHERE username = ?`,
    //   [username]
    // );
    // 
    // if (users.length === 0) {
    //   throw new Error('Gebruiker niet gevonden');
    // }
    // 
    // const friendId = users[0].id;
    // 
    // // Controleer of ze al vrienden zijn
    // const [existingFriendship] = await connection.execute(
    //   `SELECT * FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)`,
    //   [userId, friendId, friendId, userId]
    // );
    // 
    // if (existingFriendship.length > 0) {
    //   throw new Error('Deze gebruikers zijn al vrienden');
    // }
    // 
    // // Controleer of er al een verzoek bestaat
    // const [existingRequests] = await connection.execute(
    //   `SELECT * FROM friend_requests 
    //    WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)`,
    //   [userId, friendId, friendId, userId]
    // );
    // 
    // if (existingRequests.length > 0) {
    //   throw new Error('Er bestaat al een vriendschapsverzoek tussen deze gebruikers');
    // }
    // 
    // // Maak het vriendschapsverzoek aan
    // await connection.execute(
    //   `INSERT INTO friend_requests (sender_id, receiver_id, status, created_at) 
    //    VALUES (?, ?, 'pending', NOW())`,
    //   [userId, friendId]
    // );
    
    // Controleer of de gebruikersnaam niet leeg is
    if (!username.trim()) {
      throw new Error('Gebruikersnaam mag niet leeg zijn');
    }
    
    // Controleer of de gebruiker al in de vriendenlijst staat
    if (MOCK_FRIENDS.some(friend => friend.username.toLowerCase() === username.toLowerCase())) {
      throw new Error('Deze gebruiker is al je vriend');
    }
    
    // Controleer of er al een verzoek is verzonden
    if (MOCK_SENT_REQUESTS.some(friend => friend.username.toLowerCase() === username.toLowerCase())) {
      throw new Error('Je hebt al een verzoek verzonden naar deze gebruiker');
    }
    
    // Controleer of er al een verzoek is ontvangen van deze gebruiker
    if (MOCK_PENDING_REQUESTS.some(friend => friend.username.toLowerCase() === username.toLowerCase())) {
      throw new Error('Je hebt al een verzoek ontvangen van deze gebruiker');
    }
    
    // Maak een nieuw verzonden verzoek aan
    const newRequest = {
      id: generateId(),
      username: username,
      profilePicture: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 99)}.jpg`,
    };
    
    MOCK_SENT_REQUESTS.push(newRequest);
    
    return simulateApiCall({ success: true });
  } catch (error) {
    console.error('Error sending friend request:', error);
    throw error;
  }
};

export const getSentRequests = async (): Promise<Friend[]> => {
  try {
    // In een echte app zou je hier een MySQL query uitvoeren
    // Bijvoorbeeld:
    // const connection = await getConnection();
    // const [rows] = await connection.execute(
    //   `SELECT fr.receiver_id as id, u.username, u.profile_picture as profilePicture
    //    FROM friend_requests fr
    //    JOIN users u ON fr.receiver_id = u.id
    //    WHERE fr.sender_id = ? AND fr.status = 'pending'
    //    ORDER BY fr.created_at DESC`,
    //   [getCurrentUserId()]
    // );
    // return rows;
    
    // Voor nu gebruiken we nog steeds de mock data
    return simulateApiCall(MOCK_SENT_REQUESTS);
  } catch (error) {
    console.error('Error fetching sent requests:', error);
    throw error;
  }
};

export const acceptFriendRequest = async (friendId: string): Promise<Friend> => {
  try {
    // In een echte app zou je hier een MySQL query uitvoeren
    // Bijvoorbeeld:
    // const connection = await getConnection();
    // const userId = getCurrentUserId();
    // 
    // // Begin een transactie
    // await connection.beginTransaction();
    // 
    // try {
    //   // Update de status van het vriendschapsverzoek
    //   const [updateResult] = await connection.execute(
    //     `UPDATE friend_requests 
    //      SET status = 'accepted', updated_at = NOW() 
    //      WHERE sender_id = ? AND receiver_id = ? AND status = 'pending'`,
    //     [friendId, userId]
    //   );
    //   
    //   if (updateResult.affectedRows === 0) {
    //     throw new Error('Vriendschapsverzoek niet gevonden of al verwerkt');
    //   }
    //   
    //   // Bereken de compatibiliteitsscore (in een echte app zou dit gebaseerd zijn op filmvoorkeuren)
    //   const compatibilityScore = Math.floor(Math.random() * 30) + 70; // Score tussen 70-99
    //   
    //   // Maak vriendschapsrelaties in beide richtingen
    //   await connection.execute(
    //     `INSERT INTO friends (user_id, friend_id, compatibility_score, created_at) 
    //      VALUES (?, ?, ?, NOW()), (?, ?, ?, NOW())`,
    //     [userId, friendId, compatibilityScore, friendId, userId, compatibilityScore]
    //   );
    //   
    //   // Haal de gebruikersgegevens op voor de response
    //   const [users] = await connection.execute(
    //     `SELECT id, username, profile_picture as profilePicture FROM users WHERE id = ?`,
    //     [friendId]
    //   );
    //   
    //   // Commit de transactie
    //   await connection.commit();
    //   
    //   return {
    //     id: users[0].id,
    //     username: users[0].username,
    //     profilePicture: users[0].profilePicture,
    //     compatibilityScore
    //   };
    // } catch (error) {
    //   // Rollback bij fouten
    //   await connection.rollback();
    //   throw error;
    // }
    
    // Zoek het vriendschapsverzoek
    const friend = MOCK_PENDING_REQUESTS.find(f => f.id === friendId);
    
    if (!friend) {
      throw new Error('Vriendschapsverzoek niet gevonden');
    }
    
    // Verwijder uit pending en voeg toe aan vrienden
    const index = MOCK_PENDING_REQUESTS.findIndex(f => f.id === friendId);
    if (index !== -1) {
      MOCK_PENDING_REQUESTS.splice(index, 1);
    }
    
    // Voeg toe aan vrienden met een nieuwe compatibiliteitsscore
    const newFriend = {
      ...friend,
      compatibilityScore: Math.floor(Math.random() * 30) + 70 // Random score tussen 70-99
    };
    
    MOCK_FRIENDS.push(newFriend);
    
    return simulateApiCall(newFriend);
  } catch (error) {
    console.error('Error accepting friend request:', error);
    throw error;
  }
};

export const rejectFriendRequest = async (friendId: string): Promise<void> => {
  try {
    // In een echte app zou je hier een MySQL query uitvoeren
    // Bijvoorbeeld:
    // const connection = await getConnection();
    // const userId = getCurrentUserId();
    // 
    // // Update de status van het vriendschapsverzoek
    // const [updateResult] = await connection.execute(
    //   `UPDATE friend_requests 
    //    SET status = 'rejected', updated_at = NOW() 
    //    WHERE sender_id = ? AND receiver_id = ? AND status = 'pending'`,
    //   [friendId, userId]
    // );
    // 
    // if (updateResult.affectedRows === 0) {
    //   throw new Error('Vriendschapsverzoek niet gevonden of al verwerkt');
    // }
    
    // Zoek het vriendschapsverzoek in zowel ontvangen als verzonden verzoeken
    let index = MOCK_PENDING_REQUESTS.findIndex(f => f.id === friendId);
    let isSentRequest = false;
    
    if (index === -1) {
      index = MOCK_SENT_REQUESTS.findIndex(f => f.id === friendId);
      isSentRequest = true;
      
      if (index === -1) {
        throw new Error('Vriendschapsverzoek niet gevonden');
      }
    }
    
    // Verwijder uit de juiste lijst
    if (isSentRequest) {
      MOCK_SENT_REQUESTS.splice(index, 1);
    } else {
      MOCK_PENDING_REQUESTS.splice(index, 1);
    }
    
    return simulateApiCall(undefined);
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    throw error;
  }
};

export const removeFriend = async (friendId: string): Promise<void> => {
  try {
    // In een echte app zou je hier een MySQL query uitvoeren
    // Bijvoorbeeld:
    // const connection = await getConnection();
    // const userId = getCurrentUserId();
    // 
    // // Begin een transactie
    // await connection.beginTransaction();
    // 
    // try {
    //   // Verwijder de vriendschapsrelatie in beide richtingen
    //   await connection.execute(
    //     `DELETE FROM friends 
    //      WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)`,
    //     [userId, friendId, friendId, userId]
    //   );
    //   
    //   // Verwijder eventuele matches met deze vriend
    //   await connection.execute(
    //     `DELETE FROM matches 
    //      WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)`,
    //     [userId, friendId, friendId, userId]
    //   );
    //   
    //   // Commit de transactie
    //   await connection.commit();
    // } catch (error) {
    //   // Rollback bij fouten
    //   await connection.rollback();
    //   throw error;
    // }
    
    // Zoek de vriend
    const index = MOCK_FRIENDS.findIndex(f => f.id === friendId);
    
    if (index === -1) {
      throw new Error('Vriend niet gevonden');
    }
    
    // Verwijder de vriend
    MOCK_FRIENDS.splice(index, 1);
    
    // Verwijder ook eventuele matches met deze vriend
    const matchesToRemove = MOCK_MATCHES.filter(match => match.friendId === friendId);
    matchesToRemove.forEach(match => {
      const matchIndex = MOCK_MATCHES.findIndex(m => m.id === match.id);
      if (matchIndex !== -1) {
        MOCK_MATCHES.splice(matchIndex, 1);
      }
    });
    
    return simulateApiCall(undefined);
  } catch (error) {
    console.error('Error removing friend:', error);
    throw error;
  }
};

export const getCompatibilityScore = (friendId: string): number => {
  // In een echte app zou je hier een MySQL query uitvoeren
  // Bijvoorbeeld:
  // const getCompatibilityScoreFromDb = async (friendId: string): Promise<number> => {
  //   try {
  //     const connection = await getConnection();
  //     const userId = getCurrentUserId();
  //     
  //     const [rows] = await connection.execute(
  //       `SELECT compatibility_score FROM friends WHERE user_id = ? AND friend_id = ?`,
  //       [userId, friendId]
  //     );
  //     
  //     if (rows.length === 0) {
  //       return 0;
  //     }
  //     
  //     return rows[0].compatibility_score;
  //   } catch (error) {
  //     console.error('Error getting compatibility score:', error);
  //     return 0;
  //   }
  // };
  
  // Voor nu gebruiken we nog steeds de mock data
  const friend = MOCK_FRIENDS.find(f => f.id === friendId);
  return friend?.compatibilityScore || Math.floor(Math.random() * 100);
};