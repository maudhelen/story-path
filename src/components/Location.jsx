import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { deleteLocation, getLocations } from '../services/api';
import { ProjectsContext } from '../context/ProjectsContext';  // Import the context
import QrModal from './Qr'; 
import { QRCodeSVG } from 'qrcode.react';

import '../assets/styles.css';

function Location() {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);  // Initialize loading state
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState([]);
    const [isSingleMode, setIsSingleMode] = useState(true);

    const { projectId } = useParams();
    const { projects } = useContext(ProjectsContext);

    const project = projects.find((project) => project.id === parseInt(projectId));

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const data = await getLocations(projectId);
                setLocations(data);
            } catch (error) {
                console.error('Error fetching locations:', error);
                setError('There was a problem loading the locations');
            } finally {
                setLoading(false);
            }
        };

        if (projectId) {
            fetchLocations();
        }
    }, [projectId]);

    const handleDeleteLocation = async (id) => {
        try {
            await deleteLocation(id);
            setLocations((prevLocations) => prevLocations.filter((location) => location.id !== id));
            console.log('Location deleted successfully');
        } catch (error) {
            console.error('Error deleting Location:', error);
        }
    };

    const handlePrintAll = () => {
      const allLocations = locations.map(loc => ({
          value: `${projectId}-${loc.id}`,
          locationName: loc.location_name // Store names directly for each location
      }));
  
      setModalContent(allLocations);
      setIsSingleMode(false);
      setIsModalOpen(true);
  };

    const handlePrintSingle = (location) => {
      setModalContent([{
          value: `${projectId}-${location.id}`,
          locationName: location.location_name // Correctly store name
      }]);
      setIsSingleMode(true);
      setIsModalOpen(true);
  };

    const moveUp = (index) => {
        if (index === 0) return; // Already at the top
        const newLocations = [...locations];
        [newLocations[index - 1], newLocations[index]] = [newLocations[index], newLocations[index - 1]];
        setLocations(newLocations);
    };

    const moveDown = (index) => {
        if (index === locations.length - 1) return; // Already at the bottom
        const newLocations = [...locations];
        [newLocations[index + 1], newLocations[index]] = [newLocations[index], newLocations[index + 1]];
        setLocations(newLocations);
    };

    if (loading || !project) {
        return (
            <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
      <div className="container mt-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="heading"> {project.title} - Locations </h1>
              <div>
                  <button className="btn btn-warning ml-2" onClick={handlePrintAll}>
                      Print All QR Codes
                  </button>
                  <Link to={`/preview/${projectId}`} className="btn btn-primary ml-2">Preview</Link>
              </div>
          </div>
          <div className="mb-4">
              <Link to={`/addlocation/${projectId}`} className="btn btn-outline-primary">Add Location</Link>
          </div>
  
          {error && <p className="text-danger">{error}</p>}
          
          {locations.length > 0 ? (
              <ul className="list-group">
                  {locations.map((location, index) => (
                      <li key={index} className="list-group-item">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                              <div>
                                  <span className="fw-bold">{location.location_name}</span> 
                                  {location.is_published && <span className="badge bg-success badge-published ms-2">Published</span>}
                              </div>
                              <div className="btn-group btn-group-sm" role="group" aria-label="Location actions">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => moveUp(index)}
                                        disabled={index === 0}
                                    >
                                        <i className="bi bi-arrow-up"></i>
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => moveDown(index)}
                                        disabled={index === locations.length - 1}
                                    >
                                        <i className="bi bi-arrow-down"></i>
                                    </button>
                                    <Link to={`/editlocation/${projectId}/${location.id}`} className="btn btn-outline-success">Edit</Link>
                                    <button type="button" className="btn btn-outline-danger" onClick={() => handleDeleteLocation(location.id)}>Delete</button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-warning"
                                        onClick={() => handlePrintSingle(location)}
                                    >
                                        Print QR Code
                                    </button>
                                </div>
                            </div>
                          <div className="mb-2">
                              Trigger: <span>{location.location_trigger || 'N/A'}</span>
                          </div>
                          <div className="mb-2">
                              {/* <TODO> EDIT SO FORMAT FROM QUILL IS FINE</TODO> */}
                              Position: <span>{location.location_position || 'Details not available'}</span>
                          </div>
                          <div className="mb-2">
                              Points: <span>{location.score_points || 0}</span>
                          </div>
                      </li>
                  ))}
              </ul>
          ) : (
              <div>
                  <p>No locations found</p>
              </div>
          )}
  
          {/* QR Modal for displaying and printing single or all QR Codes */}
          <QrModal
            show={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            value={modalContent.map(item => item.value)}
            locations={modalContent}
            singleMode={isSingleMode}
          />
          {/* Display all QR codes in a grid */}
          <div className="row mt-4">
              <h3 className="heading mb-4">QR Codes</h3>
              {locations.map((location, index) => (
                  <div key={index} className="col-md-4 mb-4">
                      <div className="card">
                          <div className="card-body text-center">
                              <h5 className="card-title">{location.location_name || `Location ${index + 1}`}</h5>
                              <QRCodeSVG value={`${projectId}-${location.id}`} size={128} />
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );
}

export default Location;