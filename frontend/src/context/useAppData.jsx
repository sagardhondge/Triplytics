import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import API from "../utils/axios";

const useAppData = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ----------------------------- Fetch Data -----------------------------
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [profileRes, expensesRes] = await Promise.all([
          API.get("/users/me"),
          API.get("/expenses"),
        ]);
        setProfile(profileRes.data);
        setExpenses(expensesRes.data);
      } catch (err) {
        const message = err.response?.data?.message || err.message;
        setError(err.response?.status === 401 ? "Unauthorized. Please login again." : "Failed to fetch data: " + message);
        console.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // ====================== Profile ======================
  const updateProfile = async (updatedProfile) => {
    try {
      const res = await API.put("/users/me", updatedProfile);
      setProfile(res.data);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      console.error("Failed to update profile:", message);
      setError(`Failed to update profile: ${message}`);
      return null;
    }
  };

  // ====================== Expenses ======================
  const addExpense = async (newExpense) => {
    if (!newExpense.title || newExpense.amount === undefined || newExpense.amount === null) {
      console.error("Expense missing required fields", newExpense);
      setError("Expense must have a title and amount.");
      return null;
    }

    try {
      const res = await API.post("/expenses", newExpense);
      setExpenses((prev) => [...prev, res.data]);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      console.error("Failed to add expense:", message);
      setError(`Failed to add expense: ${message}`);
      return null;
    }
  };

  const updateExpense = async (id, updatedFields) => {
    try {
      const res = await API.put(`/expenses/${id}`, updatedFields);
      setExpenses((prev) => prev.map((exp) => (exp._id === id ? res.data : exp)));
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      console.error("Failed to update expense:", message);
      setError(`Failed to update expense: ${message}`);
      return null;
    }
  };

  const deleteExpense = async (id) => {
    try {
      await API.delete(`/expenses/${id}`);
      setExpenses((prev) => prev.filter((exp) => exp._id !== id));
      return true;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      console.error("Failed to delete expense:", message);
      setError(`Failed to delete expense: ${message}`);
      return false;
    }
  };

  return {
    profile,
    expenses,
    loading,
    error,
    updateProfile,
    addExpense,
    updateExpense,
    deleteExpense,
  };
};

export default useAppData;
