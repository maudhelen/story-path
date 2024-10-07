import React, { createContext, useState, useEffect } from 'react';
import { getLocations } from '../services/api';  // Import your API call

export const LocationsContext = createContext();

export const LocationsProvider = ({ projectId, children }) => {
  const [locations, setLocations] = useState([]);

  const fetchLocations = async () => {
    try {
      const data = await getLocations(projectId);
      setLocations(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchLocations();  // Fetch locations based on projectId
    }
  }, [projectId]);

  const refreshLocations = async () => {
    await fetchLocations();  // Refresh locations when called
  };

  return (
    <LocationsContext.Provider value={{ locations, setLocations, refreshLocations }}>
      {children}
    </LocationsContext.Provider>
  );
};
