import React, {useState, useEffect} from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import './App.css';
import TaskChartPage from './pages/TaskChartPage';
import Sidebar from './pages/Sidebar';

const App = () => {
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    const fetchData = () => {
      fetch('https://task-dev.onrender.com/tasks')
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
  }, []);
  
  
  return (
    <BrowserRouter>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <Routes>
          <Route exact path="/" element={<HomePage />} />
        </Routes>
        <Routes>
          <Route exact path="/charts" element={<TaskChartPage tasks={tasks} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
