import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProjectsProvider } from './context/ProjectsContext';
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProjectsList from './components/ProjectsList';
import AddProject from './components/AddProject';
import Location from './components/Location';
import AddLocation from './components/AddLocation';
import Preview from './components/Preview';

/**
 * Function that returns the main component of the application
 * @returns {JSX.Element}
 */
function App() {
  return (
    <Router>
      <ProjectsProvider>
        <div className="content app-container">
          <Navbar />
          <div className="container mt-4">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/projectslist" element={<ProjectsList />} />
              <Route path="/addproject" element={<AddProject />} />
              <Route path="/editproject/:projectId" element={<AddProject editMode />} />
              <Route path="/locations/:projectId" element={<Location />} />
              <Route path="/addlocation/:projectId" element={<AddLocation />} />
              <Route path="/editlocation/:projectId/:locationId" element={<AddLocation editMode />} />
              <Route path="/preview/:projectId" element={<Preview />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </ProjectsProvider>
    </Router>
  );
}

export default App;
