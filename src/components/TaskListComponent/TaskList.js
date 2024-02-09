import React from 'react';

const TaskList = ({ tasks }) => {

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-pending';
      case 'in-progress':
        return 'text-in-progress';
      case 'completed':
        return 'text-completed';
      default:
        return '';
    }
  };

  return (
    <div>
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task._id}>
              <h4 className='title-trunk'>{task.title}</h4>
              <p className='text-trunk'>{task.description}</p>
              <p className={`text-status ${getStatusColor(task.status)}`}>Status: {task.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
