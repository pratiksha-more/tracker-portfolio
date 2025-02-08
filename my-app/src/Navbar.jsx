import './style/Navbar.css';


function Navbar(){

    return(
        <div className="container">
        <nav className="navbar">
            <div className="logo">
                <img src="/tpp.png" alt="logo"/>
            </div>
            <div className='links'>
                <ul>
                    <li>
                        <a href="/my-app/src/BasicTracker.jsx">Basic Tracker</a>
                    </li>
                    <li>
                        <a href="/my-app/src/AdvancedSimulation.jsx">Advanced Simulation</a>
                    </li>
                    <li>
                        <a href="/my-app/src/MarketOrders.jsx">Market Orders</a>
                    </li>
                </ul>
            </div>
        </nav>
        </div>
    )
}

export default Navbar;