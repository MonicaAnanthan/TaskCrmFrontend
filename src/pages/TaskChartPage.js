import React from 'react';
import TaskChartComponent from '../components/TaskChartComponent/TaskChartComponent';

const TaskChartPage = ({ tasks }) => {
  return (
    <div>
        <TaskChartComponent tasks={tasks} />
    </div>
  );
};

export default TaskChartPage;
