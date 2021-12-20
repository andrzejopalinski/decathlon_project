import "./App.css";
import Login from "./components/login/Login";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./components/Home/Home";
import Signup from "./components/signup/Signup";
import PrivateRoute from "./components/infrastructure/router/PrivateRoute";
import AuthProvider from "./components/infrastructure/firebase/provider/AuthProvider";
import ResetPassword from "./components/login/ResetPassword";
import { User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

const App = () => {
  const { usePersistentState } = useContext<IPersistentState>(
    PersistentStateContext
  );

  const [user, setUser] = usePersistentState("User", undefined);
  const toggleUser = (newAppUser: User | undefined) => setUser(newAppUser);

  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
  };

  const goToHomePage = () => {
    navigate("/home");
  };

  return (
    <AppContext.Provider value={{ user, toggleUser }}>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={<Login goToHomepage={() => goToHomePage()} />}
          />
          <Route
            path="/signup"
            element={<Signup goToHomepage={() => goToHomePage()} />}
          />
          <Route
            path="/resetpassword"
            element={<ResetPassword goToLogin={() => goToLogin()} />}
          />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home goToLogin={() => goToLogin()} />
              </PrivateRoute>
            }
          />
          <Route
            path="*"
            element={
              <PrivateRoute>
                <Login goToHomepage={() => goToHomePage()} />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </AppContext.Provider>
  );
};

const AppWrapper = () => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

export default AppWrapper;

const usePersistentState = (key: string, defaultValue: any) => {
  const _key = `persistent_state_${key}`;
  const [getPersistentState, setPersistentState] = useState(() => {
    var storageItem = localStorage.getItem(_key);
    if (storageItem) {
      try {
        return JSON.parse(storageItem);
      } catch {
        return defaultValue;
      }
    }
    return defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(_key, JSON.stringify(getPersistentState));
  }, [key, getPersistentState]);
  return [getPersistentState, setPersistentState];
};
export interface IPersistentState {
  usePersistentState: (key: string, defaultValue: any) => any[];
}

export interface IAppContext {
  toggleUser: ((newAppUser: User | undefined) => void) | undefined;
  user: User | undefined;
}
export const PersistentStateContext = createContext<IPersistentState>({
  usePersistentState: usePersistentState,
});
const defaultAppContext: IAppContext = {
  toggleUser: undefined,
  user: undefined,
};

export const AppContext = createContext<IAppContext>(defaultAppContext);
