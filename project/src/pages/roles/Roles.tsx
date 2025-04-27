import React, { useState } from 'react';
import axios from 'axios';
import { User, ChevronDown, ChevronUp } from 'lucide-react';

const Roles = () => {
  const [roleInput, setRoleInput] = useState('');
  const [roles, setRoles] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userStoriesByRole, setUserStoriesByRole] = useState([]);
  const [error, setError] = useState(null);
  const [collapsedRoles, setCollapsedRoles] = useState({});
  const projectId = localStorage.getItem('projectid');
  console.log('Project ID:', projectId);

  const handleAddRole = () => {
    if (roleInput.trim()) {
      setRoles([...roles, roleInput.trim()]);
      setRoleInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddRole();
    }
  };

  const handleDeleteRole = (indexToDelete) => {
    setRoles(roles.filter((_, index) => index !== indexToDelete));
  };

  const handleDeleteStory = (role, storyIndex) => {
    setUserStoriesByRole(
      userStoriesByRole.map((group) =>
        group.role === role
          ? { ...group, stories: group.stories.filter((_, index) => index !== storyIndex) }
          : group
      ).filter((group) => group.stories.length > 0)
    );
  };

  const toggleRoleCollapse = (role) => {
    setCollapsedRoles({
      ...collapsedRoles,
      [role]: !collapsedRoles[role]
    });
  };

  const handleGenerateStories = async () => {
    if (roles.length === 0) {
      setError('Please add at least one role before generating stories.');
      return;
    }
    setIsGenerating(true);
    setError(null);
    setUserStoriesByRole([]);
    try {
      const response = await axios.post('http://localhost:5000/userstories/generate-plantuml', {
        projectId,
        roles
      });
      let stories = [];
      try {
        stories = JSON.parse(response.data.plantUMLCode);
        if (!Array.isArray(stories)) {
          throw new Error('Invalid data format');
        }
      } catch (err) {
        setError('Failed to parse generated user stories.');
        console.error('Parsing Error:', err);
        return;
      }

      // Group stories by role
      const storiesByRole = {};
      stories.forEach((story) => {
        const match = story.match(/As a (\w+),/);
        const role = match ? match[1] : 'Admin';
        if (!storiesByRole[role]) {
          storiesByRole[role] = [];
        }
        storiesByRole[role].push(story);
      });

      // Convert to array of objects for rendering
      const groupedStories = Object.keys(storiesByRole).map((role) => ({
        role,
        stories: storiesByRole[role]
      }));

      setUserStoriesByRole(groupedStories);
      // Initialize collapsed state for new roles
      const newCollapsed = {};
      groupedStories.forEach((group) => {
        newCollapsed[group.role] = false;
      });
      setCollapsedRoles(newCollapsed);
    } catch (err) {
      setError('Failed to generate user stories. Please ensure the backend is running and try again.');
      console.error('Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="text-white p-6 min-h-screen">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Assign Roles</h1>
        <p className="text-gray-400 mb-6">Add roles for your project team members and user.</p>
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={roleInput}
            onChange={(e) => setRoleInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter a role (e.g., Developer)"
            className="flex-1 p-3 bg-gray-800 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors duration-200"
          />
          <button
            onClick={handleAddRole}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Add
          </button>
        </div>
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-3">Assigned Roles</h2>
          {roles.length === 0 ? (
            <p className="text-gray-400 italic">No roles assigned yet. Add some above!</p>
          ) : (
            <ul className="space-y-2">
              {roles.map((role, index) => (
                <li
                  key={index}
                  className="p-4 bg-gray-800 rounded-lg text-white flex items-center justify-between transition-all duration-200 hover:bg-gray-700 hover:scale-[1.01] animate-fade-in"
                >
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-blue-400" />
                    <span className="text-base">{role}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteRole(index)}
                    className="bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm transition-colors duration-200"
                    aria-label={`Remove ${role}`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mb-6">
          <button
            onClick={handleGenerateStories}
            disabled={isGenerating}
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-lg font-medium transition-colors duration-200 ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isGenerating ? 'Generating...' : 'Generate stories for role'}
          </button>
        </div>
        {error && (
          <div className="mb-6 p-3 bg-red-900 text-red-200 rounded-lg">
            {error}
          </div>
        )}
        {userStoriesByRole.length > 0 && (
          <div>
            <h2 className="text-lg font-medium mb-3">Generated Role Based Requirement</h2>
            <div className="space-y-4">
              {userStoriesByRole.map((group) => (
                <div
                  key={group.role}
                  className="bg-gray-900 rounded-lg border border-gray-700 shadow-sm"
                >
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer"
                    onClick={() => toggleRoleCollapse(group.role)}
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-400" />
                      <h3 className="text-base font-medium">{group.role} Stories</h3>
                    </div>
                    {collapsedRoles[group.role] ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <ul className={`${collapsedRoles[group.role] ? 'hidden' : 'block'} space-y-2 p-4 pt-0`}>
                    {group.stories.map((story, index) => (
                      <li
                        key={index}
                        className="p-3 bg-gray-800 rounded-lg text-white flex items-center justify-between transition-all duration-200 hover:bg-gray-700 hover:scale-[1.01] animate-fade-in"
                      >
                        <span className="text-base">{story}</span>
                        <button
                          onClick={() => handleDeleteStory(group.role, index)}
                          className="bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm transition-colors duration-200"
                          aria-label={`Remove story: ${story}`}
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Roles;