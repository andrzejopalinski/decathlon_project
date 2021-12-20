import "firebase/auth";
import { User } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebaseSetup";

const AuthProvider: React.FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | undefined>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (user: React.SetStateAction<User | undefined> | null) => {
        if (user === undefined) console.log("User is undefined");
        if (user !== null) setCurrentUser(user);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const value: any = {
    currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export default AuthProvider;
