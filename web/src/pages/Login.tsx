import { Navigate, useNavigate } from "react-router-dom";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";
import { AuthContextType } from "@/types/auth.types";

const Login = () => {
  const { login, userAuthenticated } = useAuth() as AuthContextType;
  const navigate = useNavigate();

  if (userAuthenticated) {
    return <Navigate to="/chat" />;
  }

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      login(credentialResponse.credential);
      const origin = "/chat";
      navigate(origin);
    } catch (error) {
      console.log("Error login with google account login page: ", error);
    }
  };

  const handleError = () => {
    console.log("Error login");
  };

  return <GoogleLogin onSuccess={handleSuccess} onError={handleError} />;
};

export default Login;
