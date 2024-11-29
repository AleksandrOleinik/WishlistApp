import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import{Navigate} from 'react-router-dom';
import MainApp from './MainApp'; 
import Login from './Login'; 
import '../App.css'

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true)
    
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
        setIsAuthenticated(checkAuth());
        setLoading(false);
    }, []);

    // Function passed to Login to trigger re-authentication
    const handleLogin = () => {
        setIsAuthenticated(checkAuth());
    };
    
    useEffect(() => {
        localStorage.removeItem('user'); // Clear only the user item
    }, []);

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
                        (() => {
                            console.log('validation of the authentication',isAuthenticated); // Log the value
                            return isAuthenticated ? <MainApp LoginStatus={isAuthenticated}/> : <Navigate to="/login" />;
                        })()
                    }
                />

            </Routes>
        </Router>
    );
};

export default App;
