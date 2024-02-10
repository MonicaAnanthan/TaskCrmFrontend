import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';

const AddNewTaskComponent = ({ addTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://task-dev.onrender.com/tasks', {
        title,
        description,
        status: 'pending',
      });
      addTask(response.data);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        required
        sx={{marginBottom: '20px'}}
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        required
        multiline
        rows={4}
      />
      <Button type="submit" size='medium' className='add-btn' style={{ marginTop: '18px'}}>
        Add New Task
      </Button>
    </form>
  );
};

export default AddNewTaskComponent;
