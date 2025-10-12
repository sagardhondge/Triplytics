import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import API from "../utils/axios";

const useAppData = () => {
  const { user, loading: authLoading } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [vehiclesRes, expensesRes] = await Promise.all([
          API.get('/vehicles'),
          API.get('/expenses')
        ]);
        setVehicles(vehiclesRes.data);
        setExpenses(expensesRes.data);
      } catch (err) {
        setError("Failed to fetch data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user && !authLoading) {
      fetchData();
    }
    
    // Clear data if user logs out
    if (!user && !authLoading) {
      setVehicles([]);
      setExpenses([]);
    }
  }, [user, authLoading]);

  // Define functions to update data, which will call the API
  const addExpense = async (newExpense) => {
    try {
      const res = await API.post('/expenses', newExpense);
      setExpenses(prev => [...prev, res.data]);
      return res.data;
    } catch (err) {
      setError("Failed to add expense.");
    }
  };

  const updateExpense = async (id, updatedFields) => {
    try {
      const res = await API.put(`/expenses/${id}`, updatedFields);
      setExpenses(prev => prev.map(exp => exp._id === id ? res.data : exp));
      return res.data;
    } catch (err) {
      setError("Failed to update expense.");
    }
  };

  const deleteExpense = async (id) => {
    try {
      await API.delete(`/expenses/${id}`);
      setExpenses(prev => prev.filter(exp => exp._id !== id));
    } catch (err) {
      setError("Failed to delete expense.");
    }
  };

  const addVehicle = async (newVehicle) => {
    try {
      const res = await API.post('/vehicles', newVehicle);
      setVehicles(prev => [...prev, res.data]);
      return res.data;
    } catch (err) {
      setError("Failed to add vehicle.");
    }
  };

  const updateVehicle = async (id, updatedFields) => {
    try {
      const res = await API.put(`/vehicles/${id}`, updatedFields);
      setVehicles(prev => prev.map(veh => veh._id === id ? res.data : veh));
      return res.data;
    } catch (err) {
      setError("Failed to update vehicle.");
    }
  };

  const deleteVehicle = async (id) => {
    try {
      await API.delete(`/vehicles/${id}`);
      setVehicles(prev => prev.filter(veh => veh._id !== id));
    } catch (err) {
      setError("Failed to delete vehicle.");
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