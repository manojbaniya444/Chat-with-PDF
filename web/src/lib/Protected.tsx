import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { AuthContextType } from "@/types/auth.types";

type Props = {
  children: React.ReactNode;
};

const Protected = ({ children }: Props) => {
  const { user } = useAuth() as AuthContextType;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;
