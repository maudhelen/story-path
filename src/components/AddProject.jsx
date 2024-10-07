import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../assets/styles.css';
import { createProject, getProject, updateProject } from '../services/api';


function AddProject({ editMode }) {
    const homeScreenDisplayArr = ['Display initial clue', 'Display all locations']
    const participantScoringArr = ['Not Scored', 'Number of Scanned QR codes', 'Number of Locations Entered']
    const { projectId } = useParams(); // This is the project ID from the URL

    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [instructions, setInstructions] = useState('');
    const [initialClue, setInitialClue] = useState('');
    const [isPublished, setIsPublished] = useState(false);
    const [participantScoring, setParticipantScoring] = useState(participantScoringArr[0]);
    const [homescreenDisplay, setHomescreenDisplay] = useState(homeScreenDisplayArr[0]);
    const [error, setError] = useState('');

    /**
     * If editMode is true, fetch the project details and populate the form fields
     * with the project data.
     */
    useEffect(() => {
        if(editMode) {
            const fetchProjectDetails = async () => {
                try {
                    const projectData = await getProject(projectId);
                    console.log('projectData:', projectData);
                    const project = projectData[0];
                    setTitle(project.title);
                    setDescription(project.description);
                    setInstructions(project.instructions);
                    setInitialClue(project.initial_clue);
                    setIsPublished(project.is_published);
                    setParticipantScoring(project.participant_scoring);
                    setHomescreenDisplay(project.homescreen_display);
                } catch (error) {
                    console.error('Error fetching project:', error);
                    setError('There was a problem loading the project');
                }
            };
            if (projectId) {
                fetchProjectDetails();
            }
        }
    }, [projectId, editMode]);


    /**
     * This function is called when the form is submitted. It creates a new project object
     * with the form data and sends it to the API to create a new project.
     * Depending on whether we are in edit mode or not, it either creates a new project or
     * updates an existing project.
     * 
     * @param {Event} e  - The event object from the form submission.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newProject = {
          title,
          description,
          instructions,
          initial_clue: initialClue,
          homescreen_display: homescreenDisplay,
          is_published: isPublished,
          participant_scoring: participantScoring,
        };

        if(editMode) {
            try {
                const updatedProject = await updateProject(projectId, newProject);
                setProjects((prevProjects) =>
                    prevProjects.map((project) => 
                        project.projectId === updatedProject.projectId ? updatedProject : project
                    )
                );
                navigate('/projectslist');
            } catch (error) {
                console.error('Error updating project:', error);
                setError('There was a problem saving the project');
            }
        }
        else {
            const createdProject = await createProject(newProject);         
            setProjects([...projects, createdProject]);
            navigate("/projectslist");
        }
      };

    return (
        <div className='container mt-5'>
        <h1 className='heading mb-4'>
            {editMode ? `Edit Project: ${title}` : "Add New Project"}
        </h1>
        {error && <div className='alert alert-danger'>{error}</div>}
        <form onSubmit={handleSubmit}>
            <div className='mb-3'>
            <label htmlFor='title' className='form-label'>Title</label>
            <input
                type='text'
                className='form-control'
                id='title'
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
            />
            </div>
            <div className='mb-3'>
            <label htmlFor='description' className='form-label'>Description</label>
            <textarea
                className='form-control'
                id='description'
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
            />
            </div>
            <div className='mb-3'>
            <label htmlFor='instructions' className='form-label'>Instructions</label>
            <textarea
                className='form-control'
                id='instructions'
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                required
            />
            </div>
            <div className='mb-3'>
            <label htmlFor='initialClue' className='form-label'>Initial Clue</label>
            <input
                type='text'
                className='form-control'
                id='initialClue'
                value={initialClue}
                onChange={e => setInitialClue(e.target.value)}
                // required // Not required for now
            />
            </div>
            <div className='mb-3'>
            <label htmlFor='participantScoring' className='form-label'>Participant Scoring</label>
            <select
                id='participantScoring'
                className='form-select'
                value={participantScoring}
                onChange={e => setParticipantScoring(e.target.value)}
            >
                {participantScoringArr.map(option => (
                <option key={option} value={option}>{option}</option>
                ))}
            </select>
            </div>
            <div className='mb-3'>
            <label htmlFor='homescreenDisplay' className='form-label'>Homescreen Display</label>
            <select
                id='homescreenDisplay'
                className='form-select'
                value={homescreenDisplay}
                onChange={e => setHomescreenDisplay(e.target.value)}
            >
                {homeScreenDisplayArr.map(option => (
                <option key={option} value={option}>{option}</option>
                ))}
            </select>
            </div>
            <div className='mb-3'>
            <label htmlFor='isPublished' className='form-label'>Is Published</label>
            <input
                type='checkbox'
                className='form-check-input'
                id='isPublished'
                checked={isPublished}
                onChange={e => setIsPublished(e.target.checked)}
            />
            </div>
            <button type='submit' className='btn btn-primary'>
                {editMode ? "Edit project" : "Add project"}
            </button>
        </form>
    </div>
    );
}

    export default AddProject;

        
