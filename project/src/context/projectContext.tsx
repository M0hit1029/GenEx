import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Interface for the inner requirement objects
interface RequirementItem {
  feature: string;
  description: string;
  priority: number;
  type: string; // e.g., 'F'
  moscow: string; // e.g., 'M'
  question: string;
}

// Interface for the main document object structure
interface RequirementDocument {
  _id: string; // Represents MongoDB ObjectId as a string
  projectId: string; // Represents MongoDB ObjectId as a string
  userId: string; // Represents MongoDB ObjectId as a string
  requirements: RequirementItem[]; // Array of the inner requirement objects
  createdAt: string; // Represents ISODate as a string
  updatedAt: string; // Represents ISODate as a string
}

interface ProjectContextType {
  projectName: string;
  setProjectName: React.Dispatch<React.SetStateAction<string>>;
  userId: string | null;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
  projectId: string | null;
  setProjectId: React.Dispatch<React.SetStateAction<string | null>>;
  requirementsList: RequirementDocument[]; // Array to hold the requirement documents
  setRequirementsList: React.Dispatch<React.SetStateAction<RequirementDocument[]>>; // Setter for the array
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  // Initialize state with default values (no localStorage)
  const [projectName, setProjectName] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [requirementsList, setRequirementsList] = useState<RequirementDocument[]>([]);
  
  // Removed all useEffect hooks for localStorage syncing

  return (
    <ProjectContext.Provider value={{
       projectName : localStorage.getItem('projectname') || '',
      setProjectName,
      userId,
      setUserId,
      projectId,
      setProjectId,
      requirementsList,
      setRequirementsList
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  // Debugging line
  console.log(localStorage.getItem('token'),localStorage.getItem('productid'),localStorage.getItem('userid')) 
  console.log('Context values:', {
      projectName: context.projectName,
      userId: context.userId,
      projectId: context.projectId,
      requirementsListCount: context.requirementsList.length
  });
  console.log('project requirements',context.requirementsList)
  return context;
};