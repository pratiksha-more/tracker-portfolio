import { Link } from 'react-router-dom';
import { useState } from 'react';
import './style/Navbar.css';

function Navbar(){
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return(
        <div className="container">
            <nav className="navbar">
                <div className="logo">
                    <img src="/tpp.png" alt="logo"/>
                </div>
                <div className={`links ${isMenuOpen ? 'active' : ''}`}>
                    <ul>
                        <li>
                            <Link to="/basic-tracker" onClick={() => setIsMenuOpen(false)}>Basic Tracker</Link>
                        </li>
                        <li>
                            <Link to="/advanced-simulation" onClick={() => setIsMenuOpen(false)}>Advanced Simulation</Link>
                        </li>
                        <li>
                            <Link to="/market-orders" onClick={() => setIsMenuOpen(false)}>Market Orders</Link>
                        </li>
                    </ul>
                </div>
                <button className="mobile-menu-button" onClick={toggleMenu}>
                    <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
                </button>
            </nav>
        </div>
    );
}

export default Navbar;