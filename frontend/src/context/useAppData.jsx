import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import API from "../utils/axios";

const useAppData = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return; // Only fetch when user exists

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
        if (err.response?.status === 401) {
          setError("Unauthorized. Please login again.");
        } else {
          setError("Failed to fetch data.");
        }
        console.error(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Expenses
  const addExpense = async (newExpense) => {
    const mappedExpense = {
      ...newExpense,
      title: newExpense.platform,
      amount: newExpense.fare,
    };
    try {
      const res = await API.post("/expenses", mappedExpense);
      setExpenses((prev) => [...prev, res.data]);
      return res.data;
    } catch (err) {
      setError("Failed to add expense.");
      console.error(err.response?.data || err.message);
    }
  };

  const updateExpense = async (id, updatedFields) => {
    try {
      const res = await API.put(`/expenses/${id}`, updatedFields);
      setExpenses((prev) =>
        prev.map((exp) => (exp._id === id ? res.data : exp))
      );
      return res.data;
    } catch (err) {
      setError("Failed to update expense.");
      console.error(err.response?.data || err.message);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await API.delete(`/expenses/${id}`);
      setExpenses((prev) => prev.filter((exp) => exp._id !== id));
    } catch (err) {
      setError("Failed to delete expense.");
      console.error(err.response?.data || err.message);
    }
  };

  // Vehicles
  const addVehicle = async (newVehicle) => {
    try {
      const res = await API.post("/vehicles", newVehicle);
      setVehicles((prev) => [...prev, res.data]);
      return res.data;
    } catch (err) {
      setError("Failed to add vehicle.");
      console.error(err.response?.data || err.message);
    }
  };

  const updateVehicle = async (id, updatedFields) => {
    try {
      const res = await API.put(`/vehicles/${id}`, updatedFields);
      setVehicles((prev) =>
        prev.map((veh) => (veh._id === id ? res.data : veh))
      );
      return res.data;
    } catch (err) {
      setError("Failed to update vehicle.");
      console.error(err.response?.data || err.message);
    }
  };

  const deleteVehicle = async (id) => {
    try {
      await API.delete(`/vehicles/${id}`);
      setVehicles((prev) => prev.filter((veh) => veh._id !== id));
    } catch (err) {
      setError("Failed to delete vehicle.");
      console.error(err.response?.data || err.message);
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

