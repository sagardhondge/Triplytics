import React, { createContext, useContext, useState } from 'react';

// Create the context
const AppContext = createContext();

// Custom hook to use the context easily
export const useAppContext = () => useContext(AppContext);

// Mock data for initial loading (replace with Firebase fetching later)
const MOCK_VEHICLES = [
    { id: 1, name: "Dzire Sedan", type: "Car", mileage: 18, fuelType: "Petrol" },
    { id: 2, name: "Ertiga MUV", type: "Car", mileage: 22, fuelType: "CNG" },
];

const MOCK_EXPENSES = [
    { platform: "Ola", fare: "350", date: "2025-09-30", distance: "25", vehicle: "Dzire Sedan" },
    { platform: "Uber", fare: "400", date: "2025-10-01", distance: "30", vehicle: "Ertiga MUV" },
];


export const AppContextProvider = ({ children }) => {
    // Global state for vehicles and all recorded ride/expense entries
    const [vehicles, setVehicles] = useState(MOCK_VEHICLES);
    const [expenses, setExpenses] = useState(MOCK_EXPENSES);

    // --- Vehicle Management ---
    const updateVehicles = (newVehicles) => {
        setVehicles(newVehicles);
        // In a real app, this would trigger a database save.
    };

    // --- Expense Management ---
    // This function is used by the AddExpenseModal
    const addExpenses = (newEntries) => {
        // Ensure newEntries is an array of valid objects
        const entriesWithVehicleInfo = newEntries.map(entry => ({
            ...entry,
            // Mock distance field for calculation if not provided by modal
            distance: entry.distance || '10', 
            // Add a unique ID
            id: Date.now() + Math.random(), 
        }));
        
        setExpenses((prevExpenses) => [...prevExpenses, ...entriesWithVehicleInfo]);
    };
    
    // This function is used by the Costs page
    const updateExpenseEntries = (updatedEntries) => {
        setExpenses(updatedEntries);
    };


    const contextValue = {
        vehicles,
        updateVehicles,
        expenses,
        addExpenses,
        updateExpenseEntries,
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};
