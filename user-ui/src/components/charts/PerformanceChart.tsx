import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Box, Typography } from '@mui/material';
import type { PerformanceData } from '../../types/chart';

interface PerformanceChartProps {
  data: PerformanceData[];
  showMetrics?: (keyof Omit<PerformanceData, 'date'>)[];
  title?: string;
}

const METRIC_COLORS = {
  value: '#8884d8',
  dailyReturn: '#82ca9d',
  monthlyReturn: '#ffc658',
  annualizedReturn: '#ff7300',
  sharpeRatio: '#00C49F',
  maxDrawdown: '#ff0000'
};

const METRIC_LABELS = {
  value: '总资产',
  dailyReturn: '日收益率',
  monthlyReturn: '月收益率',
  annualizedReturn: '年化收益率',
  sharpeRatio: '夏普比率',
  maxDrawdown: '最大回撤'
};

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ 
  data, 
  showMetrics = ['value'],
  title
}) => {
  return (
    <Box sx={{ width: '100%', height: 400 }}>
      {title && (
        <Typography variant="h6" sx={{ mb: 2 }}>
          {title}
        </Typography>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={<CustomTooltip metrics={showMetrics} />} />
          <Legend />
          {showMetrics.map((metric) => (
            <Line
              key={metric}
              type="monotone"
              dataKey={metric}
              name={METRIC_LABELS[metric]}
              stroke={METRIC_COLORS[metric]}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<any>;
  label?: string;
  metrics: (keyof Omit<PerformanceData, 'date'>)[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, metrics }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: 'background.paper',
          p: 2,
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          boxShadow: 1
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          {label}
        </Typography>
        {metrics.map((metric, index) => (
          <Typography key={metric} variant="body2" sx={{ color: METRIC_COLORS[metric] }}>
            {METRIC_LABELS[metric]}: {
              metric === 'value' 
                ? `¥${payload[index]?.value?.toLocaleString()}`
                : `${payload[index]?.value?.toFixed(2)}${metric === 'maxDrawdown' ? '%' : ''}`
            }
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
}; 