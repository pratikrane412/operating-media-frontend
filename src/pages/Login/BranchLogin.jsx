import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, Building2 } from 'lucide-react';
import './Login.css';

const BranchLogin = () => {
    const [branch, setBranch] = useState('Andheri');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // Note: Sending branch name along with credentials
            const res = await axios.post('https://operating-media-backend.onrender.com/api/login/', { 
                email: username, 
                password: password,
                branch: branch 
            });
            localStorage.setItem('admin', JSON.stringify(res.data.admin));
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials for this branch');
        }
    };

    return (
        <div className="login-page-wrapper">
            <div className="login-card">
                <div className="login-header">
                    <h2>Branch <span>Login</span></h2>
                    <p>Select your branch and enter your username</p>
                </div>
                
                <form onSubmit={handleLogin} className="login-form">
                    {/* BRANCH DROPDOWN */}
                    <div className="form-group">
                        <label className="login-label">Select Branch</label>
                        <div className="input-with-icon">
                            <Building2 size={18} className="field-icon" />
                            <select 
                                className="login-input" 
                                value={branch} 
                                onChange={(e) => setBranch(e.target.value)}
                            >
                            {/* Use values that match your database exactly */}
                            <option value="Andheri">Andheri Branch</option>
                            <option value="Borivali">Borivali Branch</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="login-label">Username</label>
                        <div className="input-with-icon">
                            <User size={18} className="field-icon" />
                            <input 
                                className="login-input"
                                type="text" 
                                placeholder="Enter username" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)} 
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
                            <div className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </div>
                        </div>
                    </div>

                    {error && <div className="error-alert">{error}</div>}

                    <button type="submit" className="login-submit-btn">Login to Branch</button>

                    <div className="login-footer-link">
                        <span onClick={() => navigate('/')}>Back to Admin Login</span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BranchLogin;