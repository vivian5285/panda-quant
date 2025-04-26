import React from 'react';
import { Box, useTheme } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

interface TradeFrequencyHeatmapProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[][];
    }[];
  };
  title?: string;
}

const TradeFrequencyHeatmap: React.FC<TradeFrequencyHeatmapProps> = ({ data, title = '交易频率热力图' }) => {
  const theme = useTheme();

  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      backgroundColor: (context: any) => {
        const value = context.dataset.data[context.dataIndex];
        const alpha = (value - Math.min(...dataset.data.flat())) / (Math.max(...dataset.data.flat()) - Math.min(...dataset.data.flat()));
        return `${theme.palette.primary.main}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
      },
    })),
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
      x: {
        type: 'category' as const,
        labels: data.labels,
        title: {
          display: true,
          text: '时间',
        },
      },
      y: {
        type: 'category' as const,
        labels: data.labels,
        title: {
          display: true,
          text: '交易对',
        },
      },
    },
  };

  return (
    <Box sx={{ width: '100%', height: '100%', p: 2 }}>
      <Chart type="matrix" data={chartData} options={options} />
    </Box>
  );
};

export default TradeFrequencyHeatmap; 