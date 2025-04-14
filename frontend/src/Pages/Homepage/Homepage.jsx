import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.css";

const Homepage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/auth/user", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Not authenticated") {
          navigate("/");
        } else {
          setUser(data);
        }
      })
      .catch(() => navigate("/"));
  }, [navigate]);

  return (
    <div className="homepage-container">
      {user ? (
        <h2 className="welcome-text">Welcome, {user.displayName}</h2>
      ) : (
        <h2>Loading...</h2>
      )}
    </div>
  );
};

export default Homepage;
