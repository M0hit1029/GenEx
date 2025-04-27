import { 
  FileText, 
  MessageSquare, 
  Upload, 
  Edit, 
  Download,
  User
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Type definitions for activity items
interface ActivityItem {
  id: string;
  type: 'document' | 'chat' | 'edit' | 'upload' | 'export';
  title: string;
  time: Date;
  user: string;
}

// Sample activity data
const activityData: ActivityItem[] = [
  {
    id: '1',
    type: 'document',
    title: 'Created "Website Redesign" project',
    time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    user: 'You'
  },
  {
    id: '2',
    type: 'upload',
    title: 'Uploaded requirements.docx',
    time: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    user: 'Sarah Johnson'
  },
  {
    id: '3',
    type: 'chat',
    title: 'Started new AI chat session',
    time: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    user: 'Alex Chen'
  },
  {
    id: '4',
    type: 'edit',
    title: 'Modified requirement RF-101',
    time: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    user: 'John Smith'
  },
  {
    id: '5',
    type: 'export',
    title: 'Exported to JIRA format',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    user: 'You'
  }
];

// Icon mapping for different activity types
const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'document':
      return <FileText size={16} className="text-primary-600 dark:text-primary-400" />;
    case 'chat':
      return <MessageSquare size={16} className="text-secondary-600 dark:text-secondary-400" />;
    case 'upload':
      return <Upload size={16} className="text-accent-600 dark:text-accent-400" />;
    case 'edit':
      return <Edit size={16} className="text-warning-600 dark:text-warning-400" />;
    case 'export':
      return <Download size={16} className="text-success-600 dark:text-success-400" />;
    default:
      return <FileText size={16} />;
  }
};

const RecentActivityCard = () => {
  return (
    <div>
      <div className="flow-root">
        <ul className="-mb-8">
          {activityData.map((activity, activityIdx) => (
            <li key={activity.id}>
              <div className="relative pb-8">
                {activityIdx !== activityData.length - 1 ? (
                  <span
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                      {getActivityIcon(activity.type)}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        {activity.title}
                        <span className="ml-1 font-medium text-gray-500 dark:text-gray-400">
                          by {activity.user}
                        </span>
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(activity.time, { addSuffix: true })}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-3">
        <div className="flex justify-between items-center">
          <button
            type="button"
            className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            View all activity
          </button>
          <button
            type="button"
            className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center"
          >
            <User size={14} className="mr-1" />
            Filter by user
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentActivityCard;