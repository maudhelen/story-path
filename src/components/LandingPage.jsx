import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles.css';


function LandingPage() {

    return (  
        <div>
            <div className="hero-section text-center">
                <h1 className="mt-4">Welcome to Story Path</h1>
                <p>Disover fun projects enabling tailored activities suited for you and your friends!</p>
                <Link to="/projectslist" className="btn btn-custom btn-lg mt-3">Get Started</Link>
            </div>
        </div>
    );
}

export default LandingPage;
