import React from "react";
import { Home, Login, Signup, Chat } from "@/pages";
import Protected from "./lib/Protected";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

const App = () => {
  return (
    <main>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_OAUTH_CLIENT_ID}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/chat"
              element={
                <Protected>
                  <Chat />
                </Protected>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </main>
  );
};

export default App;
