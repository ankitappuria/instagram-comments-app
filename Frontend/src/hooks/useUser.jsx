import { createContext, useContext, useState } from "react";
 
const UserContext = createContext();
 
export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState("You");
  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
}
 
export const useUser = () => useContext(UserContext)