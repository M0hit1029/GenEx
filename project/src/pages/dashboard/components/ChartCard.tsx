import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { useProject } from '../../../context/projectContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartCardProps {
  title: string;
  subtitle?: string;
  type: 'line' | 'pie';
}

const ChartCard = ({ title, subtitle, type }: ChartCardProps) => {
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { requirementsList } = useProject();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (requirementsList.length > 0 && requirementsList[0].requirements) {
        const allRequirements = requirementsList[0].requirements;

        // Priority counts
        const priorityCount: { '1': number; '2': number; '3': number; '4': number } = {
          '1': 0,
          '2': 0,
          '3': 0,
          '4': 0,
        };

        allRequirements.forEach((req: any) => {
          const priorityKey = req.priority.toString() as keyof typeof priorityCount;
          if (priorityCount[priorityKey] !== undefined) {
            priorityCount[priorityKey]++;
          }
        });

        if (type === 'line') {
          const labels = ['Must Have', 'Should Have', 'Could Have', 'Won\'t Have'];
          setChartData({
            labels,
            datasets: [
              {
                label: 'Requirements by Priority',
                data: [
                  priorityCount['1'],
                  priorityCount['2'],
                  priorityCount['3'],
                  priorityCount['4'],
                ],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                tension: 0.3,
              },
            ],
          });
        } else if (type === 'pie') {
          setChartData({
            labels: ['Must Have', 'Should Have', 'Could Have', 'Won\'t Have'],
            datasets: [
              {
                data: [
                  priorityCount['1'],
                  priorityCount['2'],
                  priorityCount['3'],
                  priorityCount['4'],
                ],
                backgroundColor: [
                  'rgba(239, 68, 68, 0.7)',
                  'rgba(245, 158, 11, 0.7)',
                  'rgba(16, 185, 129, 0.7)',
                  'rgba(59, 130, 246, 0.7)',
                ],
                borderColor: [
                  'rgb(239, 68, 68)',
                  'rgb(245, 158, 11)',
                  'rgb(16, 185, 129)',
                  'rgb(59, 130, 246)',
                ],
                borderWidth: 1,
              },
            ],
          });
        }
      }
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [type, requirementsList]);

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden h-full">
      <div className="p-5">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <select className="text-xs rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Last year</option>
            </select>
          </div>
        </div>

        <div className="mt-4 h-60">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="animate-pulse text-gray-400 dark:text-gray-500">
                Loading chart data...
              </div>
            </div>
          ) : (
            chartData && (
              type === 'line' ? (
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                    plugins: {
                      legend: {
                        position: 'top' as const,
                        labels: {
                          boxWidth: 12,
                          usePointStyle: true,
                        },
                      },
                    },
                  }}
                />
              ) : (
                <Pie
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right' as const,
                        labels: {
                          boxWidth: 12,
                          usePointStyle: true,
                        },
                      },
                    },
                  }}
                />
              )
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartCard;
