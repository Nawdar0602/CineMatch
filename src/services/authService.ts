
// Type definities
type LoginCredentials = {
  email: string;
  password: string;
};

type RegisterData = {
  username: string;
  email: string;
  password: string;
};

type UserData = {
  id: number;
  username: string;
  email: string;
  profilePicture?: string;
  bio?: string;
};

type AuthResponse = {
  user: UserData;
  token: string;
};

// In een echte app zou je hier een MySQL database connectie configureren
// Bijvoorbeeld:
// import mysql from 'mysql2/promise';
// 
// // Database configuratie
// const dbConfig = {
//   host: 'localhost',
//   user: 'root',
//   password: 'password',
//   database: 'cinematch'
// };
// 
// // Functie om een database connectie te krijgen
// export const getConnection = async () => {
//   try {
//     const connection = await mysql.createConnection(dbConfig);
//     return connection;
//   } catch (error) {
//     console.error('Database connection error:', error);
//     throw error;
//   }
// };

// Lege array voor gebruikers (in een echte app zouden gebruikers uit de database komen)
const MOCK_USERS: any[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@cinematch.nl',
    password: 'admin123',
    profilePicture: 'https://i.pravatar.cc/150?img=1',
    bio: 'Admin gebruiker',
    isAdmin: true
  }
];

// Simuleer een API call met een timeout
const simulateApiCall = <T>(data: T, delay = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// Auth services
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    // In een echte app zou je hier een MySQL query uitvoeren
    // Bijvoorbeeld:
    // const connection = await getConnection();
    // const [rows] = await connection.execute(
    //   'SELECT * FROM users WHERE email = ?',
    //   [credentials.email]
    // );
    // 
    // const user = rows[0];
    // if (!user || !await bcrypt.compare(credentials.password, user.password)) {
    //   throw new Error('Ongeldige inloggegevens');
    // }
    
    // Voor nu simuleren we nog steeds de login, maar in een echte app zou je de bovenstaande code gebruiken
    const user = MOCK_USERS.find(u => u.email === credentials.email);
    
    if (!user || user.password !== credentials.password) {
      throw new Error('Ongeldige inloggegevens');
    }
    
    const { password, ...userData } = user;
    
    // In een echte app zou je hier een JWT token genereren
    return simulateApiCall({
      user: userData,
      token: 'mock-jwt-token-' + Math.random().toString(36).substring(2)
    });
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    // In een echte app zou je hier een MySQL query uitvoeren
    // Bijvoorbeeld:
    // const connection = await getConnection();
    // 
    // // Controleer of gebruiker al bestaat
    // const [existingUsers] = await connection.execute(
    //   'SELECT * FROM users WHERE email = ?',
    //   [data.email]
    // );
    // 
    // if (existingUsers.length > 0) {
    //   throw new Error('E-mailadres is al in gebruik');
    // }
    // 
    // // Hash het wachtwoord
    // const hashedPassword = await bcrypt.hash(data.password, 10);
    // 
    // // Voeg de nieuwe gebruiker toe
    // const [result] = await connection.execute(
    //   'INSERT INTO users (username, email, password, profile_picture, bio) VALUES (?, ?, ?, ?, ?)',
    //   [data.username, data.email, hashedPassword, `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`, '']
    // );
    // 
    // const userId = result.insertId;
    // 
    // // Haal de nieuwe gebruiker op
    // const [newUserRows] = await connection.execute(
    //   'SELECT id, username, email, profile_picture, bio FROM users WHERE id = ?',
    //   [userId]
    // );
    // 
    // const userData = newUserRows[0];
    
    // Voor nu simuleren we nog steeds de registratie, maar in een echte app zou je de bovenstaande code gebruiken
    // Controleer of gebruiker al bestaat
    if (MOCK_USERS.some(u => u.email === data.email)) {
      throw new Error('E-mailadres is al in gebruik');
    }
    
    // Simuleer registratie
    const newUser = {
      id: MOCK_USERS.length + 1,
      username: data.username,
      email: data.email,
      password: data.password, // In een echte app zou je dit hashen
      profilePicture: `https://i.pravatar.cc/150?img=${MOCK_USERS.length + 1}`,
      bio: ''
    };
    
    MOCK_USERS.push(newUser);
    
    const { password, ...userData } = newUser;
    
    // In een echte app zou je hier een JWT token genereren
    return simulateApiCall({
      user: userData,
      token: 'mock-jwt-token-' + Math.random().toString(36).substring(2)
    });
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
};

export const updateProfile = async (userId: number, data: Partial<UserData>): Promise<UserData> => {
  try {
    // In een echte app zou je hier een MySQL query uitvoeren
    // Bijvoorbeeld:
    // const connection = await getConnection();
    // 
    // // Bouw de update query dynamisch op basis van de verstrekte velden
    // const updateFields = [];
    // const updateValues = [];
    // 
    // if (data.username) {
    //   updateFields.push('username = ?');
    //   updateValues.push(data.username);
    // }
    // 
    // if (data.bio) {
    //   updateFields.push('bio = ?');
    //   updateValues.push(data.bio);
    // }
    // 
    // if (data.profilePicture) {
    //   updateFields.push('profile_picture = ?');
    //   updateValues.push(data.profilePicture);
    // }
    // 
    // if (updateFields.length === 0) {
    //   throw new Error('Geen velden om bij te werken');
    // }
    // 
    // // Voeg de userId toe aan de updateValues array
    // updateValues.push(userId);
    // 
    // // Voer de update query uit
    // await connection.execute(
    //   `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
    //   updateValues
    // );
    // 
    // // Haal de bijgewerkte gebruiker op
    // const [userRows] = await connection.execute(
    //   'SELECT id, username, email, profile_picture, bio FROM users WHERE id = ?',
    //   [userId]
    // );
    // 
    // if (userRows.length === 0) {
    //   throw new Error('Gebruiker niet gevonden');
    // }
    // 
    // return userRows[0];
    
    // Voor nu simuleren we nog steeds de profiel update, maar in een echte app zou je de bovenstaande code gebruiken
    const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('Gebruiker niet gevonden');
    }
    
    MOCK_USERS[userIndex] = {
      ...MOCK_USERS[userIndex],
      ...data
    };
    
    const { password, ...userData } = MOCK_USERS[userIndex];
    
    return simulateApiCall(userData);
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

export const validateToken = async (token: string): Promise<UserData> => {
  try {
    // In een echte app zou je hier het token valideren en de gebruiker ophalen uit de database
    // Bijvoorbeeld:
    // // Decodeer het JWT token om de gebruikers-ID te krijgen
    // const decoded = jwt.verify(token, 'your_jwt_secret');
    // const userId = decoded.userId;
    // 
    // // Haal de gebruiker op uit de database
    // const connection = await getConnection();
    // const [userRows] = await connection.execute(
    //   'SELECT id, username, email, profile_picture, bio FROM users WHERE id = ?',
    //   [userId]
    // );
    // 
    // if (userRows.length === 0) {
    //   throw new Error('Gebruiker niet gevonden');
    // }
    // 
    // return userRows[0];
    
    // Voor nu simuleren we nog steeds de token validatie, maar in een echte app zou je de bovenstaande code gebruiken
    const user = MOCK_USERS[0];
    const { password, ...userData } = user;
    
    return simulateApiCall(userData);
  } catch (error) {
    console.error('Token validation error:', error);
    throw error;
  }
};