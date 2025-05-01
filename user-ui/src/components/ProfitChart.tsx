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
import { Strategy as StrategyType } from '../types/strategy';
import { Strategy as ServiceStrategy } from '../services/strategyService';

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

type Strategy = StrategyType & ServiceStrategy;

interface ProfitChartProps {
  data: Array<{
    date: string;
    value: number;
    strategy: Strategy['riskLevel'];
  }>;
  initialAmount?: number;
  period?: number;
}

const ProfitChart: React.FC<ProfitChartProps> = ({ 
  data, 
  initialAmount = 10000,
  period = 12 
}) => {
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
    // 使用第一个数据点的策略类型
    const strategy = data[0]?.strategy || 'medium';
    const monthlyRate = strategy === 'low' ? 0.5 : strategy === 'medium' ? 1.5 : 3.0;
    let currentAmount = initialAmount;

    // 使用指定的周期
    for (let i = 0; i <= period; i += 1) {
      labels.push(`第${i + 1}个月`);
      values.push(currentAmount);
      currentAmount += currentAmount * (monthlyRate / 100); // 转换为百分比
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
      <Typography variant="h6" gutterBottom>
        {t('profitChart.title')}
      </Typography>
      <Line ref={chartRef} data={chartData} options={options} />
    </Box>
  );
};

export default ProfitChart; 