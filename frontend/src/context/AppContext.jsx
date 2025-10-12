import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/axios'; // Corrected import path
import { useAuth } from './AuthContext'; // Import the useAuth hook

// Create the context
const AppContext = createContext();

// Custom hook to use the context easily
export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
    const { user, loading: authLoading } = useAuth(); // Get user and auth loading state

    // Global state for vehicles and all recorded ride/expense entries
    const [vehicles, setVehicles] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data from backend when the user is authenticated
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
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
    }, [user, authLoading]); // Dependencies: user and authLoading

    // --- Vehicle Management ---
    const updateVehicles = async (newVehicles) => {
        try {
            // For now, we'll just update the local state.
            setVehicles(newVehicles);
        } catch (err) {
            console.error("Failed to update vehicles:", err);
        }
    };

    // --- Expense Management ---
    const addExpenses = async (newEntries) => {
        try {
            const addedExpenses = await Promise.all(
                newEntries.map(entry => API.post('/expenses', entry))
            );
            setExpenses((prevExpenses) => [...prevExpenses, ...addedExpenses.map(res => res.data)]);
        } catch (err) {
            setError("Failed to add expenses.");
            console.error(err);
        }
    };

    const updateExpenseEntries = (updatedEntries) => {
        setExpenses(updatedEntries);
    };

    const contextValue = {
        vehicles,
        updateVehicles,
        expenses,
        addExpenses,
        updateExpenseEntries,
        loading,
        error
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};