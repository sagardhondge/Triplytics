import React, { useEffect, useState } from "react";
import API from "../utils/axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get("/auth/profile"); // new route in backend
        setUser(data.user);
      } catch (err) {
        console.error(err);
        navigate("/login"); // redirect if not logged in
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>
      {user ? (
        <div>
          <p>Welcome, {user.name} 👋</p>
          <p>Email: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
