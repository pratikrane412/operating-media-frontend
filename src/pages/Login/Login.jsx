import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react'; // Import icons
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State for visibility
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/login/', { email, password });
            if (rememberMe) localStorage.setItem('rememberedEmail', email);
            else localStorage.removeItem('rememberedEmail');

            localStorage.setItem('admin', JSON.stringify(res.data.admin));
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Welcome to <span>Admin</span></h2>
                
                <form onSubmit={handleLogin}>
                    <label className="login-label">Email</label>
                    <input 
                        className="login-input"
                        type="email" 
                        placeholder="Email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />

                    <label className="login-label">Password</label>
                    <div className="password-input-wrapper">
                        <input 
                            className="login-input"
                            type={showPassword ? "text" : "password"} // Dynamic type
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                        {/* Toggle Icon */}
                        <div 
                            className="password-toggle-icon" 
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </div>
                    </div>

                    <div className="login-options">
                        <label className="remember-me">
                            <input 
                                type="checkbox" 
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)} 
                            />
                            Remember me
                        </label>
                        <a href="#" className="forgot-password">Forgot password?</a>
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="login-button">SUBMIT</button>
                </form>
            </div>
        </div>
    );
};

export default Login;