import { AuthResponse } from "@/types/auth.types";

const BASE_URL = import.meta.env.VITE_APP_API_URL;

// authenticate with google
export const authenticateWithGoogle = async (credential: string) => {
  const response = await fetch(`${BASE_URL}/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ credential }),
  });
  const data: AuthResponse = await response.json();
  return data;
};

// logout
export const logoutUser = async () => {
  try {
    const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: "GET",
      credentials: "include",
    });
    if (response.status === 200) {
      console.log("Logout success");
    }
  } catch (error) {
    console.log("Error logout: ", error);
  }
};

// verify user login
export const verifyUserLogin = async (): Promise<AuthResponse | undefined> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/verify`, {
      method: "GET",
      credentials: "include",
    });
    const data: AuthResponse = await response.json();
    return data;
  } catch (error) {
    console.log("faile to get user login info", error);
    return undefined;
  }
};
