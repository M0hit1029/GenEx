import { Bell, MessageCircle, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const DEMO_NOTIFICATIONS = [
  {
    id: '1',
    title: 'Requirements Document Updated',
    description: 'John Smith updated the requirements document',
    time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    icon: FileText,
  },
  {
    id: '2',
    title: 'New Comment on Mobile App v2',
    description: 'Sarah Johnson commented on requirement RF-103',
    time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    icon: MessageCircle,
  },
  {
    id: '3',
    title: 'Review Requested',
    description: 'Alex Chen requested your review on Website Redesign',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    icon: Bell,
  },
];

const NotificationsDropdown = () => {
  return (
    <div
      id="notifications-menu"
      className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
    >
      <div className="py-2">
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Notifications</h3>
          <span className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-200">
            {DEMO_NOTIFICATIONS.filter(n => !n.read).length} new
          </span>
        </div>
        <div className="max-h-72 overflow-y-auto">
          {DEMO_NOTIFICATIONS.length > 0 ? (
            DEMO_NOTIFICATIONS.map((notification) => (
              <div
                key={notification.id}
                className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  !notification.read ? 'bg-primary-50 dark:bg-gray-750' : ''
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <div className={`p-1 rounded-full ${
                      !notification.read 
                        ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300' 
                        : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      <notification.icon size={16} />
                    </div>
                  </div>
                  <div className="ml-3 w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {notification.title}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {notification.description}
                    </p>
                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                      {formatDistanceToNow(notification.time, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
              No notifications yet
            </div>
          )}
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          <button className="block w-full px-4 py-2 text-sm text-center text-primary-600 dark:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700">
            View all notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsDropdown;