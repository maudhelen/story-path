import React, { createContext, useState, useEffect } from 'react';
import { getProjects } from '../services/api';  // Import your API call

export const ProjectsContext = createContext();

export const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    fetchProjects();  // Fetch projects initially
  }, [projects, setProjects]);

  const refreshProjects = async () => {
    await fetchProjects();  // Fetch projects when called
  };

  return (
    <ProjectsContext.Provider value={{ projects, setProjects, refreshProjects }}>
      {children}
    </ProjectsContext.Provider>
  );
};
