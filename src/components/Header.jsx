import React, { useState } from 'react';

const Header = ({ onSubmit }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '', email: '' });
    const [isSignUp, setIsSignUp] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault(); 
        const { username, password, email } = credentials;
        if (isSignUp) {
            onSubmit(username, password, email); 
        } else {
            onSubmit(username, password); 
        }
    };

    const toggleMode = () => {
        setIsSignUp((prev) => !prev);
        setCredentials({ username: '', password: '', email: '' }); 
    };

    return (
        <header className="header">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={credentials.username}
                    onChange={handleInputChange}
                    autoComplete="username"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                />
                {isSignUp && (
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={credentials.email}
                        onChange={handleInputChange}
                        autoComplete="email"
                    />
                )}
                <button type="submit">{isSignUp ? 'Sign Up' : 'Login'}</button>
            </form>
            <button type="button" onClick={toggleMode}>
                {isSignUp ? 'Switch to Login' : 'Switch to Sign Up'}
            </button>
        </header>
    );
};

export default Header;
