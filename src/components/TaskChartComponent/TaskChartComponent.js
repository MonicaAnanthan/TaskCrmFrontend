import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const TaskChartComponent = ({ tasks }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    renderCharts();
  }, [tasks]);

  const renderCharts = () => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const pendingCount = tasks.filter(task => task.status === 'pending').length;
    const inProgressCount = tasks.filter(task => task.status === 'in-progress').length;
    const completedCount = tasks.filter(task => task.status === 'completed').length;

    const ctx = document.getElementById('taskChart').getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['To Do(Pending)', 'Doing(In Progress)', 'Done(Completed)'],
        datasets: [
          {
            label: 'Task Status',
            data: [pendingCount, inProgressCount, completedCount],
            backgroundColor: [
              '#ffd078', 
              '#ababf5',
              '#aad0aa',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(75, 192, 192, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };

  return(
    <div className='canvas-box'>
       <canvas id="taskChart" width="200" height="200" ></canvas>
    </div>
  );
};

export default TaskChartComponent;
