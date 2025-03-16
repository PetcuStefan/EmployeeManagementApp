import React from "react";
import "./Login.css";

const Login = () => {
  const handleGoogleLogin = () => {
    window.open("http://localhost:5000/auth/google", "_self");
  };

  return (
    <div className="login-container">
      <h2>Login with Google</h2>
      <button className="google-btn" onClick={handleGoogleLogin}>
      <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google Logo" />        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
