import { daysToWeeks } from 'date-fns';
import { createContext, useContext, useState, ReactNode } from 'react';

type userRole = 'analyst'; // Define user roles as needed

interface UserData {
  
  fullname:string;
  email: string;
  role:userRole;
}

interface UserContextType {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.fullname) {
          return parsedUser;
        }
      }
    } catch (error) {
      console.error('Error parsing stored user data:', error);
    }
    return null;
  });

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('projectname');
    localStorage.removeItem('procuctid');
    localStorage.removeItem('userid');
    localStorage.removeItem('requirements');
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
   const token = localStorage.getItem('token');
   console.log(token); // Get token from localStorage
  if (!token) {
    console.log('No token found in localStorage');
  }
  
  return context;
}