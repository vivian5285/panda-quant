import React from 'react';
import { motion } from 'framer-motion';
import PandaCard from './common/PandaCard';
import { fadeIn } from '../animations';

interface AssetOverviewProps {
  totalAssets: number;
  totalProfit: number;
  activeStrategies: number;
  successRate: number;
}

export const AssetOverview: React.FC<AssetOverviewProps> = ({
  totalAssets,
  totalProfit,
  activeStrategies,
  successRate,
}) => {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      variants={fadeIn}
      initial="initial"
      animate="animate"
    >
      <PandaCard>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-700">Total Assets</h3>
          <p className="text-2xl font-bold text-primary">${totalAssets.toLocaleString()}</p>
        </div>
      </PandaCard>

      <PandaCard>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-700">Total Profit</h3>
          <p className="text-2xl font-bold text-green-500">${totalProfit.toLocaleString()}</p>
        </div>
      </PandaCard>

      <PandaCard>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-700">Active Strategies</h3>
          <p className="text-2xl font-bold text-blue-500">{activeStrategies}</p>
        </div>
      </PandaCard>

      <PandaCard>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-700">Success Rate</h3>
          <p className="text-2xl font-bold text-purple-500">{successRate}%</p>
        </div>
      </PandaCard>
    </motion.div>
  );
}; 