import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    label: string;
    positive: boolean;
  };
}

const StatCard = ({ title, value, icon, trend }: StatCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-primary-100 dark:bg-primary-900/30 p-3 rounded-md">
            <div className="text-primary-600 dark:text-primary-400">
              {icon}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
              {title}
            </div>
            <div className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                {value}
              </div>
              {trend && (
                <div className="ml-2 flex items-baseline text-sm">
                  <span
                    className={`flex items-center ${
                      trend.positive
                        ? 'text-success-600 dark:text-success-400'
                        : 'text-error-600 dark:text-error-400'
                    }`}
                  >
                    {trend.positive ? (
                      <TrendingUp size={12} className="mr-1" />
                    ) : (
                      <TrendingDown size={12} className="mr-1" />
                    )}
                    {trend.value}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">
                    {trend.label}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;