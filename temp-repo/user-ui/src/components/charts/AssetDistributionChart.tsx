import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface AssetDistributionData {
  total: number;
  byCurrency: Record<string, number>;
  byStrategy: Record<string, number>;
}

interface AssetDistributionChartProps {
  data: AssetDistributionData;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const AssetDistributionChart: React.FC<AssetDistributionChartProps> = ({ data }) => {
  const currencyData = Object.entries(data.byCurrency).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={currencyData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {currencyData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow">
        <p className="font-medium">{data.name}</p>
        <p className="text-primary-600">${data.value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const CustomLegend: React.FC<any> = ({ payload }) => {
  return (
    <div className="flex justify-center mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={`legend-${index}`} className="flex items-center mx-2">
          <div
            className="w-3 h-3 mr-1"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-600">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}; 