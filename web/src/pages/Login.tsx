import { useLocation, useNavigate } from "react-router-dom";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";
import { AuthContextType } from "@/types/auth.types";

const Login = () => {
  const { login } = useAuth() as AuthContextType;
  const location = useLocation();
  const navigate = useNavigate();

  const handleSuccess = (credentialResponse: CredentialResponse) => {
    try {
      if (credentialResponse.credential) {
        login(credentialResponse.credential);
        const origin = location.state?.from?.pathname || "/";
        navigate(origin);
      }
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
