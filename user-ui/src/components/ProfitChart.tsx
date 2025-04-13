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

interface ProfitData {
  date: string;
  profit: number;
  strategyId: string;
}

interface ProfitChartProps {
  data: ProfitData[];
}

const ProfitChart: React.FC<ProfitChartProps> = ({ data }) => {
  // 按日期分组并计算总收益
  const groupedData = data.reduce((acc, curr) => {
    const existingDate = acc.find(item => item.date === curr.date);
    if (existingDate) {
      existingDate.profit += curr.profit;
    } else {
      acc.push({ date: curr.date, profit: curr.profit });
    }
    return acc;
  }, [] as { date: string; profit: number }[]);

  // 按日期排序
  const sortedData = groupedData.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <Typography variant="h6" gutterBottom>
        收益趋势
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={sortedData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
          />
          <YAxis />
          <Tooltip 
            formatter={(value: number) => [`${value.toFixed(2)}`, '收益']}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="profit"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            name="收益"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ProfitChart; 