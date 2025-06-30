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
      <img
      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
      alt="Google Logo"
      style={{ width: "20px", marginRight: "10px" }}
      />
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
