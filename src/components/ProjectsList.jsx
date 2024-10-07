import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { deleteProject, getProjects } from '../services/api';

import '../assets/styles.css';


function ProjectsList() {

    const [projects, setProjects] = useState([]);

    /**
     * Fetch projects when the component mounts and update the state with the projects data.
     */
    useEffect(() => {
        const fetchProjects = async () => {
        try {
            const data = await getProjects();
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
        };
        fetchProjects();
    }, []);

    /**
     * Delete a project when the delete button is clicked and update the state to remove the project.
     * @param {Number} id 
     */
    const handleDeleteProject = async (id) => {
        try {
          await deleteProject(id); // Call the API to delete the project
          setProjects((prevProjects) => prevProjects.filter((project) => project.id !== id));
          console.log('Project deleted successfully');
        } catch (error) {
          console.error('Error deleting Project:', error);
        }
      };

    return (
        <div>
            <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className='heading'>Projects</h1>
            </div>
            <Link to="/addproject" className="btn btn-outline-primary mb-4">Add Project</Link>
            <ul className="list-group">
                {projects.map((project, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                    <div className="fw-bold">
                        {project.title}
                        <span className={`badge ms-2 ${project.is_published ? 'badge-published' : 'badge-unpublished'}`}>
                        {project.is_published ? 'Published' : 'Not Published'}
                        </span>
                    </div>
                    <div>
                        <span className='d-inline-block text-truncate' style={{ maxWidth: '350px' }}>
                        {project.description}
                        </span>
                    </div>
                    </div>
                    <div className="btn-group btn-group-sm" role="group" aria-label="Project actions">
                        {/* <button type="button" className="btn btn-outline-secondary">Edit</button> */}
                        <Link to={`/editproject/${project.id}`} className="btn btn-outline-secondary">Edit</Link>
                        <Link to={`/locations/${project.id}`} className="btn btn-outline-primary">View Locations</Link>
                        <button type="button" className="btn btn-outline-danger" onClick={() => handleDeleteProject(project.id)}>Delete</button>
                    </div>
                </li>
                ))}
            </ul>
            </div>
        </div>
        );
    };

export default ProjectsList;
