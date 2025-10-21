import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import API from "../utils/axios";

const useAppData = () => {
  const { user } = useAuth();

  const [vehicles, setVehicles] = useState([]);
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
        const [vehiclesRes, expensesRes] = await Promise.all([
          API.get("/vehicles"),
          API.get("/expenses"),
        ]);
        setVehicles(vehiclesRes.data);
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

  // ====================== Expenses ======================
  const addExpense = async (newExpense) => {
    // Validate required fields before sending
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
    if ("title" in updatedFields && !updatedFields.title) {
      setError("Expense title cannot be empty.");
      return null;
    }
    if ("amount" in updatedFields && (updatedFields.amount === undefined || updatedFields.amount === null)) {
      setError("Expense amount cannot be empty.");
      return null;
    }

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

  // ====================== Vehicles ======================
  const addVehicle = async (newVehicle) => {
    if (!newVehicle.name) {
      setError("Vehicle name is required.");
      return null;
    }

    try {
      const res = await API.post("/vehicles", newVehicle);
      setVehicles((prev) => [...prev, res.data]);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      console.error("Failed to add vehicle:", message);
      setError(`Failed to add vehicle: ${message}`);
      return null;
    }
  };

  const updateVehicle = async (id, updatedFields) => {
    if ("name" in updatedFields && !updatedFields.name) {
      setError("Vehicle name cannot be empty.");
      return null;
    }

    try {
      const res = await API.put(`/vehicles/${id}`, updatedFields);
      setVehicles((prev) => prev.map((veh) => (veh._id === id ? res.data : veh)));
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      console.error("Failed to update vehicle:", message);
      setError(`Failed to update vehicle: ${message}`);
      return null;
    }
  };

  const deleteVehicle = async (id) => {
    try {
      await API.delete(`/vehicles/${id}`);
      setVehicles((prev) => prev.filter((veh) => veh._id !== id));
      return true;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      console.error("Failed to delete vehicle:", message);
      setError(`Failed to delete vehicle: ${message}`);
      return false;
    }
  };

  return {
    vehicles,
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    addVehicle,
    updateVehicle,
    deleteVehicle,
  };
};

export default useAppData;
