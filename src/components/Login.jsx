import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({onLogin}) => {
    const [credentials, setCredentials] = useState({ username: '', password: '', name: '' });
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, password, name } = credentials;
        try {
            if (isSignUp) {
                //console.log(credentials);
                await axios.post('http://localhost:3001/signup', { username, password, name });
                setIsSignUp(false);
            } else {
                const response = await axios.post('http://localhost:3001/login', { name, password });
                if (response.data) {
                    //console.log('User logged in:', response.data);
                    localStorage.setItem('user', JSON.stringify(response.data));
                    console.log("check the user",localStorage.getItem('user'));
                    onLogin();
                    navigate('/Wishlists'); 
                }
                 else {
                    alert('Invalid credentials');
                }
            }
        } catch (error) {
            console.error('Error during login/signup', error);
        }
    };

    const toggleMode = () => {
        setIsSignUp((prev) => !prev);
        setCredentials({ username: '', password: '', name: '' });
    };

    return (
        <div className="login_page">
            <form onSubmit={handleSubmit} className='login_form'>
                {isSignUp?(<input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={credentials.username}
                    onChange={handleInputChange}
                    autoComplete="username"
               />):(<input
                type="text"
                name="name"
                placeholder="Email"
                value={credentials.name}
                onChange={handleInputChange}
                autoComplete="email"
           />)}
                
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    autoComplete="current-password"
                />
                {isSignUp && (
                    <input
                        type="email"
                        name="name"
                        placeholder="Email"
                        value={credentials.name}
                        onChange={handleInputChange}
                        autoComplete='email'
                    />
                )}
                <button type="submit" className={isSignUp ? 'signup_button' : 'login_button'}>{isSignUp ? 'Sign Up' : 'Login'}</button>
            </form>
            <button onClick={toggleMode} className={`login_signup_btn ${isSignUp ? 'signup_mode' : 'login_mode'}`}>
            {isSignUp ? 'Switch to Login' : 'Switch to Sign Up'}</button>
        </div>
    );
};

export default Login;