import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import for redirection

const Homepage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    fetch("http://localhost:5000/auth/user", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Not authenticated") {
          navigate("/"); // Redirect to login page if not logged in
        } else {
          setUser(data); // Set user data
        }
      })
      .catch(() => navigate("/"));
  }, [navigate]);

  const handleLogout = () => {
    window.open("http://localhost:5000/auth/logout", "_self");
  };

  return (
    <div>
      {user ? (
        <>
          <h2>Welcome, {user.displayName}</h2>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <h2>Loading...</h2>
      )}
    </div>
  );
};

export default Homepage;

