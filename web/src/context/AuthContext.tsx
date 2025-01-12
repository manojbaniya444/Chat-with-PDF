import { AuthContextType, UserInfo } from "@/types/auth.types";
import { createContext, useState, useContext, useEffect } from "react";
import {
  authenticateWithGoogle,
  logoutUser,
  verifyUserLogin,
} from "@/api/auth.api";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<null | UserInfo>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [userAuthenticated, setUserAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      setLoading(true);
      try {
        const data = await verifyUserLogin();
        if (data?.user) {
          setUser(data.user);
          setUserAuthenticated(true);
        }
        console.log("User set success");
        setLoading(false);
      } catch (error) {
        console.log("Failed to verify user login: ", error);
        setUserAuthenticated(false);
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  console.log(user);

  const login = async (googleCredential: string) => {
    try {
      const { user } = await authenticateWithGoogle(googleCredential);
      if (user) {
        setUser(user);
        setUserAuthenticated(true);
        console.log("Login successful: ", user);
      }
    } catch (error) {
      console.log("Login failed: ", error);
      throw error;
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setUserAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, loading, logout, userAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
