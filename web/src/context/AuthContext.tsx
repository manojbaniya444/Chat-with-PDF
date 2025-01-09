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

  useEffect(() => {
    const checkLoginStatus = async () => {
      setLoading(true);
      try {
        const data = await verifyUserLogin();
        if (data?.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.log("Failed to verify user login: ", error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const login = async (googleCredential: string) => {
    try {
      const { token, user } = await authenticateWithGoogle(googleCredential);
      if (token && user) {
        setUser(user);
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
  };

  return (
    <AuthContext.Provider value={{ user, login, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
