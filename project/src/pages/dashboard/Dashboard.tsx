import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Upload,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useUser } from '../../context/userDataContext';
import ChartCard from './components/ChartCard';

const Dashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickAction = (action: string) => {
    setIsLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      
      switch (action) {
        case 'upload':
          navigate('/projects/1/documents');
          break;
        case 'manual':
          navigate('/projects/1/requirements');
          break;
        case 'roles':
          navigate('/projects/1/roles');
          break;
        default:
          break;
      }
    }, 500);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-10 ">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white ">
          Welcome back, {user?.fullname}!
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Here's what's happening with your requirements projects.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {/* <StatCard 
          title="Active Projects" 
          value={3} 
          icon={<FileText size={20} />} 
          trend={{
            value: '+1',
            label: 'from last month',
            positive: true
          }}
        /> */}
        {/* <StatCard 
          title="Pending Reviews" 
          value={5} 
          icon={<Clock size={20} />} 
          trend={{
            value: '-2',
            label: 'from last week',
            positive: true
          }}
        /> */}
        {/* <StatCard 
          title="Recent Exports" 
          value={12} 
          icon={<FileOutput size={20} />} 
          trend={{
            value: '+4',
            label: 'from last week',
            positive: true
          }}
        /> */}
      </div>
      
      <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard 
            title="Requirements Progress" 
            subtitle="Requirements added over time" 
            type="line"
          />
        </div>
        <div>
          <ChartCard 
            title="MoSCoW Distribution" 
            subtitle="Current requirements by priority" 
            type="pie"
          />
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Button
            variant="outline"
            className="h-auto p-4 justify-start"
            onClick={() => handleQuickAction('upload')}
            isLoading={isLoading}
            leftIcon={<Upload size={18} className="text-primary-600 dark:text-primary-400" />}
          >
            <div className="text-left">
              <div className="font-medium">Upload Documents</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Add Word, PDF, Excel files
              </div>
            </div>
          </Button>
          
          
          
          <Button
            variant="outline"
            className="h-auto p-4 justify-start"
            onClick={() => handleQuickAction('manual')}
            isLoading={isLoading}
            leftIcon={<PlusCircle size={18} className="text-accent-600 dark:text-accent-400" />}
          >
            <div className="text-left">
              <div className="font-medium">Show Extracted Requirements</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Requirements
              </div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="h-auto p-4 justify-start"
            onClick={() => handleQuickAction('roles')}
            isLoading={isLoading}
            leftIcon={<PlusCircle size={18} className="text-accent-600 dark:text-accent-400" />}
          >
            <div className="text-left">
              <div className="font-medium">Roles Assign</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Assign roles to team members
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;