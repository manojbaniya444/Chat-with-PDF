export interface AuthContextType {
  user: any;
  login: (userData: any) => void;
  logout: () => void;
  loading: boolean;
}

// type for user info after login
export interface UserInfo {
  email: string;
  name: string;
  picture: string;
  id: string;
}

// auth response type
export interface AuthResponse {
  token: string;
  user: UserInfo;
}
