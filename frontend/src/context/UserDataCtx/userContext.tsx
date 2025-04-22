import { createContext, useState } from "react";
import { UserModel } from "../../models/UserModel";

interface UserContextType extends UserModel {
  setUser: (user: Partial<UserContextType>) => void;
  reset: () => void;
  error: string | null,
  loading: boolean
}
const UserContext = createContext<UserContextType>({
  userid: "",
  username: "",
  email: "",
  role: null,
  setUser: (user: Partial<UserContextType>) => { },
  reset: () => { },

  error: null,
  loading: false
});
export default UserContext;


interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userDetails, setUserDetailes] = useState<Partial<UserContextType>>({ userid: "", username: "", email: "", role: null, error: null, loading: false });
  const setTheUser = (data: Partial<UserContextType>) => {
    setUserDetailes((prev: Partial<UserContextType>) => {
      return { ...prev, ...data }
    })
  }
  const reset = () => {
    setUserDetailes({ userid: "", username: "", email: "", error: null, loading: false })
  }
  return (
    <UserContext.Provider
      value={{
        userid: userDetails.userid!,
        username: userDetails.username!,
        email: userDetails.email,
        role: userDetails.role || null,
        setUser: setTheUser,
        error: userDetails.error!,
        loading: userDetails.loading!,
        reset
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
