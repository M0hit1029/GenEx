import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderPlus, 
  FileStack, 
  GitBranch, 
  Settings,
  PlusCircle
} from 'lucide-react';
import { useUser } from '../../context/userDataContext';

const SideNavigation = () => {
  const location = useLocation();
  const { user } = useUser();
  console.log('User role:', user?.role); // Debugging line
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'analyst', 'reviewer'],
    },
    {
      name: 'New Project',
      href: '/new-project',
      icon: PlusCircle,
      roles: ['admin', 'analyst'],
    },
    {
      name: 'Requirement Hub',
      href: '/requirements',
      icon: FileStack,
      roles: ['admin', 'analyst', 'reviewer'],
    },
    {
      name: 'Version History',
      href: '/versions',
      icon: GitBranch,
      roles: ['admin', 'analyst', 'reviewer'],
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      roles: ['admin', 'analyst', 'reviewer'],
    },
  ];

  // Filter navigation items by user role
  const filteredNavigation = navigation.filter(item => 
    item.roles.includes('analyst')
  );

  return (
    <nav className="flex-1 space-y-1 px-2 pb-4">
      {filteredNavigation.map((item) => {
        const active = isActive(item.href);
        
        return (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
              active
                ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <item.icon
              className={`mr-3 h-5 w-5 flex-shrink-0 ${
                active ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'
              }`}
              aria-hidden="true"
            />
            {item.name}
          </Link>
        );
      })}
      
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-4">
        <h3 className="px-3 text-sm font-medium text-gray-500 dark:text-gray-400">
          Recent Projects
        </h3>
        <div className="mt-1 space-y-1">
          {['Website Redesign', 'Mobile App v2', 'Customer Portal'].map((project, index) => (
            <Link
              key={index}
              to={`/projects/${index + 1}/requirements`}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              <FolderPlus className="mr-3 h-4 w-4 text-gray-400" />
              {project}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default SideNavigation;