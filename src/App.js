import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import './App.css';
import TaskChartPage from './pages/TaskChartPage';
import Sidebar from './pages/Sidebar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (token !== null) {
      const fetchData = () => {
        fetch('https://task-dev.onrender.com/tasks', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setTasks(data);
        })
        .catch(error => {
          console.error('Error fetching tasks:', error);
        });
      };
  
      fetchData();
      const intervalId = setInterval(fetchData, 5000);
      return () => clearInterval(intervalId);
    }
  }, [token]);
  
  const handleSignUp = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  return (
    <BrowserRouter>
      <div style={{ display: 'flex' }}>
      {token && <Sidebar isLoggedIn={true} onLogout={handleLogout} />}
        <Routes>
        {!token && <Route path="/signup" element={<SignupPage onSignUp={handleSignUp} />} />}
          {!token && <Route path="/" element={<LoginPage onLogin={handleLogin} />} />}
          {token && <Route path="/home" element={<HomePage />} />}
          {token && <Route path="/charts" element={<TaskChartPage tasks={tasks} />} />}
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
