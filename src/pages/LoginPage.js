import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';


const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://task-dev.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }
      const { token } = await response.json();
      onLogin(token);
      navigate("/home");
    } catch (error) {
      console.error('Login error:', error.message);
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="log-wrap">
      <Card sx={{ my: 2, minWidth: 400, padding: '1rem' }}>
        <CardContent>
          <h2 style={{textAlign:'center'}}>Login</h2>
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className='form-grp'>
              <label>Email:</label>
              <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="off" />
            </div>
            <div className='form-grp'>
              <label>Password:</label>
              <input className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="off" />
            </div>
            <button type="submit" className='log-btn'>Login</button>
          </form>
          <Link component={Link} to='/signup' style={{color:'#686769', fontSize:'14px', fontWeight:'600', textAlign:'center', display:'block'}}>Sign Up</Link>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;