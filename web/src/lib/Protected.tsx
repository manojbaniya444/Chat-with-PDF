import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { AuthContextType } from "@/types/auth.types";

type Props = {
  children: React.ReactNode;
};

const Protected = ({ children }: Props) => {
  const { loading, userAuthenticated } = useAuth() as AuthContextType;

  if (loading) {
    console.log("loading");
    return <h1>Loading ...</h1>;
  }

  if (!userAuthenticated) {
    console.log("user not authenticated so going to login page");
    return <Navigate to="/login" />;
  }

  console.log("hurray user login done");
  return children;
};

export default Protected;
