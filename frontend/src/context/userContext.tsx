import { createContext, useState } from "react";
import { UserModel } from "../models/UserModel";

interface UserContextType extends UserModel {
  setUser: (user: Partial<UserContextType>) => void;
  error: string | null,
  loading: boolean
}
const UserContext = createContext<UserContextType>({
  userId: "",
  userName: "",
  setUser: (user: Partial<UserContextType>) => { },
  error: null,
  loading: false
});
export default UserContext;


interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userDetails, setUserDetailes] = useState<Partial<UserContextType>>({ userId: "", userName: "", error: null, loading: false });
  const setTheUser = (data: Partial<UserContextType>) => {
    setUserDetailes((prev: Partial<UserContextType>) => {
      return { ...prev, ...data }
    })
  }
  return (
    <UserContext.Provider
      value={{
        userId: userDetails.userId!,
        userName: userDetails.userName!,
        setUser: setTheUser,
        error: userDetails.error!,
        loading: userDetails.loading!
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
