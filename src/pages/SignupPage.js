import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

const SignupPage = ({ onSignUp }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://task-dev.onrender.com/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                throw new Error('Sign up failed');
            }
            const { token } = await response.json();
            onSignUp(token);
            navigate("/home");
            window.location.reload();
        } catch (error) {
            console.error('Sign up error:', error.message);
            setError('Sign up failed. Please try again.');
        }
    };

    return (
        <div className="log-wrap">
            <Card sx={{ my: 2, minWidth: 400, padding: '1rem' }}>
                <CardContent>
                    <h2 style={{textAlign:'center'}}>Sign Up</h2>
                    <form onSubmit={handleSubmit} autoComplete="off">
                        <div className='form-grp'>
                            <label>Email:</label>
                            <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="off" />
                        </div>
                        <div className='form-grp'>
                            <label>Password:</label>
                            <input className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="off" />
                        </div>
                        <button type="submit" className='log-btn'>Sign Up</button>
                    </form>
                    <Link component={Link} to='/' style={{color:'#686769', fontSize:'14px', fontWeight:'600', textAlign:'center', display:'block'}}>Back to Login</Link>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </CardContent>
            </Card>
        </div>
    );
};

export default SignupPage;
