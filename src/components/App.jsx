import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MainApp from './MainApp'; 
import Login from './Login'; 
import ViewPage from './ViewPage';
import '../App.css';
import '../LoginPage.css'
import '../WishlistMenu.css'
import '../ItemsOverview.css'
import '../AddItem.css'

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true); 
    const baseURL_deploy ="https://wishlistapp.onrender.com"
    const baseURL_locally = ""
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
        
        const isAuth = checkAuth();
        setIsAuthenticated(isAuth);
        setLoading(false); 
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(checkAuth());
    };

    if (loading) {
        
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
                <Route
                    path="/View/:id" 
                    element={<ViewPage />}
                />
            </Routes>
        </Router>
    );
};

export default App;
