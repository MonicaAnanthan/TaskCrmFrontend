import { useState, useEffect } from 'react';
import TaskList from '../TaskListComponent/TaskList';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddNewTaskComponent from '../AddNewTaskComponent/AddNewTaskComponent';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [anchorEl, setAnchorEl] = useState({});
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [editedTaskData, setEditedTaskData] = useState({ title: '', description: '' });

  const pendingTasks = tasks.filter((task) => task.status === 'pending');
  const inProgressTasks = tasks.filter((task) => task.status === 'in-progress');
  const completedTasks = tasks.filter((task) => task.status === 'completed');

  const addNewTask = (newTask) => {
    setTasks([newTask, ...tasks]);
    handleCloseModal();
  };

  const handleClick = (taskId) => (event) => {
    setAnchorEl({ ...anchorEl, [taskId]: event.currentTarget });
    setSelectedTaskId(taskId);
  };

  const handleClose = (taskId) => () => {
    setAnchorEl((prevAnchorEl) => ({ ...prevAnchorEl, [taskId]: null }));
    setSelectedTaskId(null);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    fetch('https://task-dev.onrender.com/tasks')
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
      });
  }, []);

  const deleteTask = (taskId) => {
    fetch(`https://task-dev.onrender.com/tasks/${taskId}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete task');
        }
        const updatedTasks = tasks.filter(task => task._id !== taskId);
        setTasks(updatedTasks);
      })
      .catch(error => {
        console.error('Error deleting task:', error);
      });
  };

  const moveTask = (taskId, newStatus) => {
    fetch(`https://task-dev.onrender.com/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to move task');
        }
        const updatedTasks = tasks.map(task => {
          if (task._id === taskId) {
            return { ...task, status: newStatus };
          }
          return task;
        });
        setTasks(updatedTasks);
        handleClose(taskId)();
      })
      .catch(error => {
        console.error('Error moving task:', error);
      });
  };

  const handleEdit = (task) => {
    setEditMode(task._id); 
    setEditedTaskData({ title: task.title, description: task.description }); 
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveEdit = (taskId) => {
    editTask(taskId, { title: editedTaskData.title, description: editedTaskData.description });
    setEditMode(null); 
  };

  const handleCancelEdit = () => {
    setEditMode(null); 
  };

  const editTask = (taskId, updatedTaskData) => {
    const taskToUpdate = tasks.find(task => task._id === taskId);
    if (!taskToUpdate) {
      console.error('Task not found');
      return;
    }

    const updatedTask = { ...taskToUpdate, ...updatedTaskData };

    fetch(`https://task-dev.onrender.com/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedTask)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update task');
        }
        const updatedTasks = tasks.map(task => {
          if (task._id === taskId) {
            return updatedTask;
          }
          return task;
        });
        setTasks(updatedTasks);
        handleClose(taskId)();
      })
      .catch(error => {
        console.error('Error updating task:', error);
      });
  };


  return (
    <div className="task-dashboard">
      <div className='top-sec'>
        <h3>Task Management Board</h3>
        <Button
          size='large'
          className='add-btn'
          startIcon={<AddIcon />}
          onClick={handleOpenModal}
        >
          Add New Task
        </Button>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="add-task-modal-title"
          aria-describedby="add-task-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
            }}
          >
            <h2 id="add-task-modal-title">Add New Task</h2>
            <AddNewTaskComponent addTask={addNewTask} />
          </Box>
        </Modal>
      </div>
      <div className="status-section">
        <div className="status-column">
          <h3>To Do</h3>
          <div className='status-box'>
            {pendingTasks.map((task) => (
              <Card key={task._id} elevation={2} sx={{ my: 2, minWidth: 275 }}>
                <CardContent>
                  <div className='card-box'>
                    {editMode === task._id ? (
                      <div className='edit-box'>
                        <input
                          type="text"
                          name="title"
                          value={editedTaskData.title}
                          onChange={handleInputChange}
                        />
                        <textarea
                          name="description"
                          value={editedTaskData.description}
                          onChange={handleInputChange}
                        />
                      </div>
                    ) : (
                      <TaskList tasks={[task]} />
                    )}
                  </div>
                  <div className='card-action'>
                    <div>
                      <Button
                        size="medium"
                        className='action-btn'
                        onClick={handleClick(task._id)}
                        aria-controls={`task-menu-${task._id}`}
                        aria-haspopup="true"
                      >
                        Move to <KeyboardArrowDownIcon />
                      </Button>
                      <Menu
                        id={`task-menu-${task._id}`}
                        anchorEl={anchorEl[task._id] || null}
                        open={selectedTaskId === task._id && Boolean(anchorEl[task._id])}
                        onClose={handleClose(task._id)}
                      >
                        <MenuItem onClick={() => moveTask(task._id, 'in-progress')}>
                          Doing
                        </MenuItem>
                        <MenuItem onClick={() => moveTask(task._id, 'completed')}>
                          Done
                        </MenuItem>
                      </Menu>
                    </div>
                    <div>
                      {editMode === task._id ? (
                        <div className='save-btngroup'>
                          <button onClick={() => handleSaveEdit(task._id)}>Save</button>
                          <button onClick={handleCancelEdit}>Cancel</button>
                        </div>
                      ) : (
                        <IconButton
                          className="delete-btn"
                          aria-label="edit"
                          onClick={() => handleEdit(task)}
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                    </div>
                    <div>
                      <IconButton className="delete-btn" aria-label="delete" onClick={() => deleteTask(task._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="status-column">
          <h3>Doing</h3>
          <div className='status-box'>
            {inProgressTasks.map((task) => (
              <Card key={task._id} elevation={2} sx={{ my: 2, minWidth: 275 }}>
                <CardContent>
                  <div className='card-box'>
                    {editMode === task._id ? (
                      <div className='edit-box'>
                        <input
                          type="text"
                          name="title"
                          value={editedTaskData.title}
                          onChange={handleInputChange}
                        />
                        <textarea
                          name="description"
                          value={editedTaskData.description}
                          onChange={handleInputChange}
                        />
                      </div>
                    ) : (
                      <TaskList tasks={[task]} />
                    )}
                  </div>
                  <div className='card-action'>
                    <div>
                      <Button
                        size="medium"
                        className='action-btn'
                        onClick={handleClick(task._id)}
                        aria-controls={`task-menu-${task._id}`}
                        aria-haspopup="true"
                      >
                        Move to <KeyboardArrowDownIcon />
                      </Button>
                      <Menu
                        id={`task-menu-${task._id}`}
                        anchorEl={anchorEl[task._id] || null}
                        open={selectedTaskId === task._id && Boolean(anchorEl[task._id])}
                        onClose={handleClose(task._id)}
                      >
                        <MenuItem onClick={() => moveTask(task._id, 'pending')}>
                          To Do
                        </MenuItem>
                        <MenuItem onClick={() => moveTask(task._id, 'completed')}>
                          Done
                        </MenuItem>
                      </Menu>
                    </div>
                     <div>
                      {editMode === task._id ? (
                        <div className='save-btngroup'>
                          <button onClick={() => handleSaveEdit(task._id)}>Save</button>
                          <button onClick={handleCancelEdit}>Cancel</button>
                        </div>
                      ) : (
                        <IconButton
                          className="delete-btn"
                          aria-label="edit"
                          onClick={() => handleEdit(task)}
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                    </div>
                    <div>
                      <IconButton className="delete-btn" aria-label="delete" onClick={() => deleteTask(task._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="status-column">
          <h3>Done</h3>
          <div className='status-box'>
            {completedTasks.map((task) => (
              <Card key={task._id} elevation={2} sx={{ my: 2, minWidth: 275 }}>
                <CardContent>
                  <div className='card-box'>
                    {editMode === task._id ? (
                      <div className='edit-box'>
                        <input
                          type="text"
                          name="title"
                          value={editedTaskData.title}
                          onChange={handleInputChange}
                        />
                        <textarea
                          name="description"
                          value={editedTaskData.description}
                          onChange={handleInputChange}
                        />
                      </div>
                    ) : (
                      <TaskList tasks={[task]} />
                    )}
                  </div>
                  <div className='card-action'>
                    <div>
                      <Button
                        size="medium"
                        className='action-btn'
                        onClick={handleClick(task._id)}
                        aria-controls={`task-menu-${task._id}`}
                        aria-haspopup="true"
                      >
                        Move to <KeyboardArrowDownIcon />
                      </Button>
                      <Menu
                        id={`task-menu-${task._id}`}
                        anchorEl={anchorEl[task._id] || null}
                        open={selectedTaskId === task._id && Boolean(anchorEl[task._id])}
                        onClose={handleClose(task._id)}
                      >
                        <MenuItem onClick={() => moveTask(task._id, 'pending')}>
                          To Do
                        </MenuItem>
                        <MenuItem onClick={() => moveTask(task._id, 'in-progress')}>
                          Doing
                        </MenuItem>
                      </Menu>
                    </div>
                     <div>
                      {editMode === task._id ? (
                        <div className='save-btngroup'>
                          <button onClick={() => handleSaveEdit(task._id)}>Save</button>
                          <button onClick={handleCancelEdit}>Cancel</button>
                        </div>
                      ) : (
                        <IconButton
                          className="delete-btn"
                          aria-label="edit"
                          onClick={() => handleEdit(task)}
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                    </div>
                    <div>
                      <IconButton className="delete-btn" aria-label="delete" onClick={() => deleteTask(task._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default TaskDashboard;