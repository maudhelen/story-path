
import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles.css';

function NavBar() {
    return ( 
        <div> 
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
            {/* <a className="navbar-brand navbar-brand-custom" href="landingpage.html">STORYPATH</a> */}
            <Link to="/" className="navbar-brand navbar-brand-custom">STORYPATH</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <Link to="/projectslist" className="nav-link" >Projects</Link>
                    </li>
                </ul>
            </div>
            </nav>  
        </div>
    );
}

export default NavBar;