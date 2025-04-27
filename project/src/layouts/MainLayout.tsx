import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, ChevronDown, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useUser } from '../context/userDataContext';
import SideNavigation from '../components/navigation/SideNavigation';
import ProjectSwitcher from '../components/navigation/ProjectSwitcher';
import NotificationsDropdown from '../components/navigation/NotificationsDropdown';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useUser();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('#user-menu-button') && !target.closest('#user-menu')) {
        setUserMenuOpen(false);
      }
      if (!target.closest('#notifications-button') && !target.closest('#notifications-menu')) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-gray-900/50 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-lg font-semibold text-primary-600 dark:text-primary-400">RequirementsAI</h1>
          <button
            type="button"
            className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        <SideNavigation />
      </div>

      <div className="flex min-h-screen flex-col">
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex items-center">
                <button
                  type="button"
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu size={24} />
                </button>
              </div>

              <div className="flex items-center space-x-6">
                <div className="hidden md:block">
                  <h1 className="text-lg font-semibold text-primary-600 dark:text-primary-400">RequirementsAI</h1>
                </div>
                <ProjectSwitcher />
              </div>

              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <div className="relative">
                  <button
                    id="notifications-button"
                    type="button"
                    className="rounded-full p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      setNotificationsOpen(!notificationsOpen);
                      setUserMenuOpen(false);
                    }}
                  >
                    <Bell size={20} />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-error-500 ring-2 ring-white dark:ring-gray-900" />
                  </button>
                  {notificationsOpen && <NotificationsDropdown />}
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    id="user-menu-button"
                    type="button"
                    className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                    onClick={() => {
                      setUserMenuOpen(!userMenuOpen);
                      setNotificationsOpen(false);
                    }}
                  >
                    <span className="mr-2 hidden md:inline-block">{user?.fullname}</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 text-sm font-medium text-primary-800 dark:text-primary-200">
                      {user?.fullname?.[0]}
                    </span>
                    <ChevronDown size={16} className="ml-1" />
                  </button>

                  {userMenuOpen && (
                    <div
                      id="user-menu"
                      className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 z-50"
                    >
                      <div className="py-1">
                        <div className="block px-4 py-2 text-sm text-gray-500 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">
                          <div className="font-medium text-gray-800 dark:text-white">
                            {user?.fullname} ({user?.organization})
                          </div>
                          <div className="text-xs">{user?.email}</div>
                        </div>
                        <button
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => {
                            setUserMenuOpen(false);
                            navigate('/settings');
                          }}
                        >
                          <SettingsIcon size={16} className="mr-2" />
                          Settings
                        </button>
                        <button
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={handleLogout}
                        >
                          <LogOut size={16} className="mr-2" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-1">
          <div className="flex flex-col flex-1">
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
              <Outlet />
            </main>
            <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>RequirementsAI Platform &copy; {new Date().getFullYear()}</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
