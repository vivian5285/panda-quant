import React from 'react';
import { Box, useTheme } from '@mui/material';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RiskMetricsRadarProps {
  data: {
    labels: string[];
    values: number[];
  };
  title?: string;
}

const RiskMetricsRadar: React.FC<RiskMetricsRadarProps> = ({ data, title = '风险指标雷达图' }) => {
  const theme = useTheme();

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: '风险指标',
        data: data.values,
        backgroundColor: `${theme.palette.primary.main}40`,
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
        pointBackgroundColor: theme.palette.primary.main,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: theme.palette.primary.main,
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
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
        },
      },
    },
  };

  return (
    <Box sx={{ width: '100%', height: '100%', p: 2 }}>
      <Radar data={chartData} options={options} />
    </Box>
  );
};

export default RiskMetricsRadar; 