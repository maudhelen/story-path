import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProjectsContext } from '../context/ProjectsContext';
import { getLocations } from '../services/api';  

const Preview = () => {
  const { projects } = useContext(ProjectsContext);
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [locations, setLocations] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState('home');
  const [visitedLocationsCount, setVisitedLocationsCount] = useState(0);
  const [pointsScored, setPointsScored] = useState(0);

  const project = projects.find(proj => proj.id === parseInt(projectId)); 

  /**
   * Fetch locations for the project when the component mounts
   * and update the state with the locations data.
   */
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationData = await getLocations(projectId);
        setLocations(locationData);
        setVisitedLocationsCount(0); 
        setPointsScored(0);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    if (projectId) {
      fetchLocations();
    }
  }, [projectId]);

  const totalPoints = locations.reduce((sum, location) => sum + location.score_points, 0);

  const handleBackClick = () => {
    navigate(-1); 
  };

  /**
   * If the selected location is the home screen, display the initial clue or all locations, depending on project settings.
   * @returns The content to be displayed in the preview based on the selected location.
   */
  const renderContent = () => {
    if (selectedLocationId === 'home') {
      if (project && project.homescreen_display === "Display initial clue") {
        return <p>Initial Clue: {project.initial_clue}</p>;
      }

      return (
        <div>
          {locations.map(location => (
            <div key={location.id} className="location-detail">
              <h5>{location.location_name}</h5>
              <div dangerouslySetInnerHTML={{ __html: location.location_content }} />
              {location.clue && <p><em>Clue: {location.clue}</em></p>}
              <hr />
            </div>
          ))}
        </div>
      );
    } else {
      const selectedLocation = locations.find(loc => loc.id.toString() === selectedLocationId);
      return (
        <div>
          <h5>{selectedLocation.location_name}</h5>
          <div
            dangerouslySetInnerHTML={{ __html: selectedLocation.location_content }}
          />
          {selectedLocation.clue && <p><em>Clue to next location: {selectedLocation.clue}</em></p>}
        </div>
      );
    }
  };

  return (
    <div className="container mt-4 mb-3">
      <button onClick={handleBackClick} className="btn btn-outline-secondary mb-3">&larr; Back</button>
      <select
              className="form-select mb-3"
              onChange={(e) => setSelectedLocationId(e.target.value)}
            >
              <option value="home">HomeScreen</option>
              {locations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.location_name}
                </option>
              ))}
        </select>
      <div className="d-flex justify-content-center mt-3">
        <div className="card"
          style={{ 
              width: '520px',  
              height: '800px',
              backgroundColor: '#f8f9fa',
              overflow: 'auto'
          }}>
          <div className="card-body d-flex flex-column">
            <h5 className="card-title heading">{project ? project.title : 'Project Title'}</h5>
            <p className="card-text">{project ? project.instructions : 'Project Instructions'}</p>
            <hr />
            
            <div className="flex-grow-1 overflow-auto">
              {renderContent()}
            </div>

            <div className="d-flex mt-3 justify-content-around">
              <div className="rounded-box bg-warning text-center text-white p-2" style={{ width: '45%' }}>
                Locations visited: {visitedLocationsCount}/{locations.length}
              </div>
              <div className="rounded-box bg-warning text-center text-white p-2" style={{ width: '45%' }}>
                {selectedLocationId === 'home'
                  ? `Points scored: 0/${totalPoints}`
                  : `Points scored: ${locations.find(loc => loc.id.toString() === selectedLocationId)?.score_points || 0}/${totalPoints}`
                }
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
