import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { createLocation, getLocations, updateLocation } from '../services/api';

function AddLocation( { editMode } ) {
    const locationTriggerArr = ['Location entry', 'QR Code Scan', 'Both Location entry and QR Code Scan'];
    const { projectId, locationId } = useParams();

    const navigate = useNavigate();

    const [locations, setLocations] = useState([]);
    
    const [locationName, setLocationName] = useState('');
    const [locationTrigger, setLocationTrigger] = useState(locationTriggerArr[0]);
    const [locationPosition, setLocationPosition] = useState('');
    const [scorePoints, setPoints] = useState('');
    const [clue, setClue] = useState('');
    const [locationContent, setLocationContent] = useState('');
    const [latitude, setLatitude] = useState(-27.49763095777103);  // Default latitude Brisbane
    const [longitude, setLongitude] = useState(153.01313638687137);  // Default longitude Brisbane
    const [error, setError] = useState('');

    const quillModules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],

            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],    // superscript/subscript
            [{ 'indent': '-1' }, { 'indent': '+1' }],        // outdent/indent
            [{ 'direction': 'rtl' }],                        // text direction

            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],

            ['link', 'image'],                               // add image support
            ['clean']                                         // remove formatting button
        ],
    };

    /**
     * This useEffect hook fetches the location details when in edit mode.
     * It populates the form with the location details.
     */
    useEffect(() => {
        // If in edit mode, fetch the location details and populate the form
        if(editMode) {
            const fetchLocationDetails = async () => {
                try {
                    const locationData = await getLocations(projectId);
                    const location = locationData.find((location) => location.id === parseInt(locationId));
                    setLocationName(location.location_name);
                    setLocationTrigger(location.location_trigger);
                    setLocationPosition(location.location_position);
                    let [lng, lat] = location.location_position.split(',');
                    // Remove ) at end of lat and ( at start of long
                    lng = lng.slice(1);
                    lat = lat.slice(0, -1);
                    console.log('Latitude:', lat);
                    console.log('Longitude:', lng);
                    setLatitude(lat);
                    setLongitude(lng);
                    setPoints(location.score_points);
                    setClue(location.clue);
                    setLocationContent(location.location_content);
                } catch (error) {
                    console.error('Error fetching project:', error);
                    setError('There was a problem loading the project');
                }
            };
            if (projectId) {
                fetchLocationDetails();
            }
        }
        else {
            //fetch location details
            const fetchLocationDetails = async () => {
                try {
                    const locationData = await getLocations(projectId);
                    setLocations(locationData);
                } catch (error) {
                    console.error('Error fetching project:', error);
                    setError('There was a problem loading the project');
                }
            };
            if (projectId) {
                fetchLocationDetails();
            };
        }
    }, [projectId, editMode]);

    /**
     * This function is called when the form is submitted.
     * It creates a new location object and sends it to the API to create a new location.
     * @param {Event} e 
     * @returns {Promise<void>}
     * 
     */
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const newLocation = {
            project_id: projectId,
            location_name: locationName,
            location_trigger: locationTrigger,
            location_position: locationPosition,
            score_points: scorePoints,
            clue: clue,
            location_content: locationContent,
            extra: locations.length,
        };

        console.log('Creating Location:', newLocation);
        console.log('Resolved Project ID NEW:', projectId);

        // If edit mode, update the location
        if(editMode) {
            try {
                const updatedLocation = await updateLocation(locationId, newLocation);
                setLocations((prevLocation) =>
                    prevLocation.map((location) => 
                        location.id === updatedLocation.id ? updatedLocation : location
                    )
                );
                navigate('/locations/' + projectId);
            } catch (error) {
                console.error('Error updating project:', error);
                setError('There was a problem saving the project');
            }
        }
        else {
            const createdLocation = await createLocation(newLocation);         
            setLocations([...locations, createdLocation]);
            navigate('/locations/' + projectId);
        }
      };

    /**
     * LocationMarker component that captures the latitude and longitude
     * when the map is clicked and updates the state with the new position.
     * 
     * @returns {JSX.Element} A Marker component positioned at the captured latitude and longitude.
     */
      function LocationMarker() {
        useMapEvents({
            click(e) {
                const lat = e.latlng.lat;  // Capture latitude
                const lng = e.latlng.lng;  // Capture longitude
                setLatitude(lat);
                setLongitude(lng);
                setLocationPosition(`${lng}, ${lat}`);  // Set as "long, lat"
            },
        });
    
        return <Marker position={[latitude, longitude]} />;
    }
    /**
     * This component sets the map view to the specified latitude and longitude.
     * @param {latitude} param0 
     * @param {longitude} param1
     * @returns null
     */
    function SetMapView({ latitude, longitude }) {
        const map = useMap();
        useEffect(() => {
          map.setView([latitude, longitude], map.getZoom(), { animate: true });
        }, [latitude, longitude, map]);
      
        return null;
    }

      return (
        <div className="container mt-5">
            <h1 className="heading mb-4">{editMode ? 'Edit' : 'Add' } Location 
            </h1>
            <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                    <label htmlFor="locationName" className="form-label">Location Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="locationName"
                        value={locationName}
                        onChange={e => setLocationName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="locationTrigger" className="form-label">Location Trigger</label>
                    <select
                        id="locationTrigger"
                        className="form-select"
                        value={locationTrigger}
                        onChange={e => setLocationTrigger(e.target.value)}
                    >
                        {locationTriggerArr.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="locationPosition" className="form-label">Location Position (lat, long)</label>
                    <input
                        type="text"
                        className="form-control"
                        id="locationPosition"
                        value={locationPosition}
                        onChange={e => setLocationPosition(e.target.value)}
                        placeholder="Ex: 37.7749, -122.4194"
                        required
                    />
                </div>
                {/* Advanced feature: MapContainer component to display the map and capture the location */}
                <MapContainer center={[latitude, longitude]} zoom={13} style={{ height: '300px', width: '100%' }} className="mb-3">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[latitude, longitude]} />
                    <LocationMarker />
                    <SetMapView latitude={latitude} longitude={longitude} />
                </MapContainer>
                <div className="mb-3">
                    <label htmlFor="points" className="form-label">Points for Reaching Location</label>
                    <input
                        type="number"
                        className="form-control"
                        id="points"
                        value={scorePoints}
                        onChange={e => {
                            const value = parseInt(e.target.value);
                            // Set the points only if the value is a non-negative number
                            if (!isNaN(value) && value >= 0) {
                                setPoints(value);
                            } else {
                                // Optionally clear the input for invalid case or handle as needed
                                setPoints('');
                            }
                        }}
                        min="0" // Ensure input accepts only non-negative values
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="clue" className="form-label">Clue</label>
                    <textarea
                        className="form-control"
                        id="clue"
                        value={clue}
                        onChange={e => setClue(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="locationContent" className="form-label">Location Content</label>
                    <ReactQuill
                        theme="snow"
                        value={locationContent}
                        onChange={setLocationContent}
                        modules={quillModules}
                        formats={[
                            'header', 'font', 'size',
                            'bold', 'italic', 'underline', 'strike', 'blockquote',
                            'list', 'bullet', 'indent',
                            'link', 'image', 'video', 'color', 'background'
                        ]}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Add Location</button>
            </form>
        </div>
    );
}

export default AddLocation;