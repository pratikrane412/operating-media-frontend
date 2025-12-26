import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
        <div className="login-page-wrapper">
            <div className="login-card">
                <div className="login-header">
                    <h2>Welcome to <span>Admin</span></h2>
                    <p>Enter your credentials to access your account</p>
                </div>
                
                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label className="login-label">Email Address</label>
                        <div className="input-with-icon">
                            <Mail size={18} className="field-icon" />
                            <input 
                                className="login-input"
                                type="email" 
                                placeholder="name@company.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="login-label">Password</label>
                        <div className="password-input-wrapper">
                            <Lock size={18} className="field-icon" />
                            <input 
                                className="login-input"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                            <div 
                                className="password-toggle-icon" 
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </div>
                        </div>
                    </div>

                    <div className="login-options">
                        <label className="remember-me-checkbox">
                            <input 
                                type="checkbox" 
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)} 
                            />
                            <span>Remember me</span>
                        </label>
                        <a href="#" className="forgot-link">Forgot password?</a>
                    </div>

                    {error && <div className="error-alert">{error}</div>}

                    <button type="submit" className="login-submit-btn">Sign In</button>

                    {/* --- NEW OPTION --- */}
                    <div className="login-footer-link">
                        <span onClick={() => navigate('/login')}>Login with branch</span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;