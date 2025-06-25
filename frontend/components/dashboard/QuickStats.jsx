import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const QuickStats = ({ title, value, change, trend }) => {
  const getTrendIcon = () => {
    if (trend === 'up') return TrendingUp;
    if (trend === 'down') return TrendingDown;
    return Minus;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-secondary-600';
  };

  const TrendIcon = getTrendIcon();

  return (
    <div className="bg-white p-6 rounded-lg border border-secondary-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-secondary-600">{title}</p>
          <p className="text-2xl font-bold text-secondary-900">{value}</p>
        </div>
        {change && (
          <div className={`flex items-center ${getTrendColor()}`}>
            <TrendIcon className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">{change}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickStats;