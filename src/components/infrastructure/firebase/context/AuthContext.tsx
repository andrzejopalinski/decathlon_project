import React, { useContext } from "react";
import { User } from "firebase/auth";

export const AuthContext = React.createContext<User | undefined>(undefined);

export function useAuth() {
  return useContext(AuthContext);
}
