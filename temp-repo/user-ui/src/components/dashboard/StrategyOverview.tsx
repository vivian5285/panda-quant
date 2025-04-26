import React from 'react';
import { motion } from 'framer-motion';
import { PandaCard } from '../PandaCard';
import { fadeIn } from '../../animations';

interface Strategy {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'paused' | 'stopped';
  performance: {
    monthlyReturn: number;
    winRate: number;
    maxDrawdown: number;
  };
}

interface StrategyOverviewProps {
  strategies: Strategy[];
}

const StrategyOverview: React.FC<StrategyOverviewProps> = ({ strategies }) => {
  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {strategies.map((strategy) => (
        <PandaCard key={strategy.id}>
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-700">{strategy.name}</h3>
              <span className={`px-2 py-1 rounded text-sm ${
                strategy.status === 'active' ? 'bg-green-100 text-green-800' :
                strategy.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {strategy.status}
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Monthly Return: <span className="font-semibold">{strategy.performance.monthlyReturn}%</span>
              </p>
              <p className="text-sm text-gray-600">
                Win Rate: <span className="font-semibold">{strategy.performance.winRate}%</span>
              </p>
              <p className="text-sm text-gray-600">
                Max Drawdown: <span className="font-semibold">{strategy.performance.maxDrawdown}%</span>
              </p>
            </div>
          </div>
        </PandaCard>
      ))}
    </motion.div>
  );
};

export default StrategyOverview; 