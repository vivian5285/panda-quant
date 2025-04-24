import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StrategyReturnDistributionProps {
  data: {
    labels: string[];
    values: number[];
  };
  title?: string;
}

const StrategyReturnDistribution: React.FC<StrategyReturnDistributionProps> = ({ data, title = '策略收益分布' }) => {
  const theme = useTheme();

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: '收益分布',
        data: data.values,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.dark,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '频次',
        },
      },
      x: {
        title: {
          display: true,
          text: '收益区间',
        },
      },
    },
  };

  return (
    <Box sx={{ width: '100%', height: '100%', p: 2 }}>
      <Bar data={chartData} options={options} />
    </Box>
  );
};

export default StrategyReturnDistribution; 