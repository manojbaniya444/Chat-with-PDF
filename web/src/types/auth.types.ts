export interface AuthContextType {
  user: any;
  login: (userData: any) => void;
  logout: () => void;
  loading: boolean;
  userAuthenticated: boolean;
}

// type for user info after login
export interface UserInfo {
  email: string;
  username: string;
  profile: string;
  id: string;
  plan: string;
  created_at: Date;
}

// auth response type
export interface AuthResponse {
  user: UserInfo;
  success: boolean;
  message: string;
}
