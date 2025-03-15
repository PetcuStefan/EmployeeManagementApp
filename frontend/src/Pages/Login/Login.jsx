import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For React Router v6, use 'useNavigate' instead of 'useHistory'

const Login = () => {
  const navigate = useNavigate(); // React Router v6 hook for navigation

  // This function will be called when the user successfully signs in
  const handleCredentialResponse = (response) => {
    const idToken = response.credential; // Get ID token from the Google Sign-In response

    // Send the ID token to your backend for verification
    fetch('http://localhost:5000/api/auth/google-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: idToken }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Redirect to the main dashboard or homepage upon successful login
          navigate('/homepage'); // Use 'navigate' from React Router v6
        } else {
          alert('Authentication failed');
        }
      })
      .catch((err) => {
        console.error('Login error', err);
        alert('Something went wrong. Please try again.');
      });
  };

  useEffect(() => {
    console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID); // Log to verify it's correctly accessed
    // Initialize Google Sign-In when the component is mounted
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, // Use the same client ID as your backend
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById('google-signin-btn'),
      { theme: 'outline', size: 'large' } // Customize button appearance
    );
  }, []);

  return (
    <div className="login-container">
      <h2>Login with Google</h2>
      <div id="google-signin-btn"></div> {/* Google Sign-In button */}
    </div>
  );
};

export default Login;
