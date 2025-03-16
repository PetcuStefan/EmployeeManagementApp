import React, { useEffect, useState } from "react";

const Homepage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/auth/user", {
      credentials: "include", // Important for sessions
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

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
        <h2>Please log in</h2>
      )}
    </div>
  );
};

export default Homepage;
