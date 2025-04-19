import React, { useEffect, useRef } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  ChartTypeRegistry
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';

// 注册 Chart.js 组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ProfitData {
  amount: number;
  period: number;
  strategy: string;
  profit: number;
}

interface ProfitChartProps {
  data: ProfitData;
}

const ProfitChart: React.FC<ProfitChartProps> = ({ data }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const chartRef = useRef<ChartJS<'line', (number | null)[], unknown>>(null);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  // 生成模拟数据
  const generateChartData = () => {
    const labels = [];
    const values = [];
    const monthlyRate = data.strategy === 'low' ? 0.5 : data.strategy === 'medium' ? 1.5 : 3.0;
    let currentAmount = data.amount;

    for (let i = 0; i <= data.period; i += 30) {
      labels.push(`第${i/30 + 1}个月`);
      values.push(currentAmount);
      currentAmount += currentAmount * monthlyRate;
    }

    return { labels, values };
  };

  const { labels, values } = generateChartData();

  const chartData: ChartData<'line'> = {
    labels,
    datasets: [
      {
        label: '预期收益',
        data: values,
        borderColor: theme.palette.primary.main,
        backgroundColor: 'rgba(0, 255, 184, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: theme.palette.text.primary,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.primary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: theme.palette.divider,
        },
        ticks: {
          color: theme.palette.text.secondary,
        },
      },
      x: {
        grid: {
          color: theme.palette.divider,
        },
        ticks: {
          color: theme.palette.text.secondary,
        },
      },
    },
  };

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <Typography 
        variant="h6" 
        sx={{
          color: theme.palette.text.primary,
          mb: 2,
        }}
      >
        收益趋势
      </Typography>
      <Line 
        ref={chartRef}
        data={chartData} 
        options={options}
        style={{ width: '100%', height: '100%' }}
      />
    </Box>
  );
};

export default ProfitChart; 