import { useState, useEffect } from 'react';
import { ChevronDown, FolderOpen } from 'lucide-react';
import { useProject } from '../../context/projectContext';

const ProjectSwitcher = () => {
  const { setProjectName, projectName } = useProject();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState({ id: '1', name: projectName });

  useEffect(() => {
    // Update selected project if the projectName in context changes
    setSelectedProject({ id: '1', name: projectName });
  }, [projectName]);

  const handleSelect = (projectName: string) => {
    setSelectedProject({ id: '1', name: projectName });
    setIsOpen(false);
    setProjectName(projectName); // Update the context with the selected project name
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="inline-flex items-center gap-x-1 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FolderOpen size={16} className="text-gray-500 dark:text-gray-400" />
        <span className="truncate max-w-[150px]">{selectedProject.name}</span>
        <ChevronDown 
          size={14} 
          className="text-gray-400 transition-transform duration-200"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-56 origin-top-right rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 overflow-hidden">
          <div className="p-1">
            {/* You can replace DEMO_PROJECTS with an actual list of projects */}
            <button
              key="1"
              className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                selectedProject.name === projectName
                  ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
              onClick={() => handleSelect(projectName)}
            >
              {projectName}
            </button>
            <div className="border-t border-gray-200 dark:border-gray-700 mt-1 pt-1">
              <button
                className="w-full text-left px-3 py-2 text-sm text-primary-600 dark:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                View All Projects
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectSwitcher;
