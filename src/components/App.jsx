import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MainApp from './MainApp'; // Extracted main content of App
import Login from './Login'; // New Login component
import '../App.css';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); // Track loading state

    const checkAuth = () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            return user && user.user_id && user.name;
        } catch (error) {
            console.error('Error parsing user from localStorage', error);
            return false;
        }
    };

    useEffect(() => {
        // Perform the authentication check
        const isAuth = checkAuth();
        setIsAuthenticated(isAuth);
        setLoading(false); // Mark loading as complete
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(checkAuth());
    };

    if (loading) {
        // Show a loading spinner or placeholder while the auth state is being determined
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <Routes>
                <Route 
                    path="/login" 
                    element={<Login onLogin={handleLogin}/>} 
                />
                <Route
                    path="/Wishlists"
                    element={
                        isAuthenticated ? <MainApp LoginStatus={isAuthenticated}/> : <Navigate to="/login" />
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
