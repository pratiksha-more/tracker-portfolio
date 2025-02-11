import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import BasicTracker from './BasicTracker';
import AdvancedSimulation from './AdvancedSimulator';
import MarketOrders from './MarketOrders';
import './style/App.css';

function App() {
  return (
    <Router>
      <div className="app-container">    
        <Navbar />
        <div className="app-content">
          <Routes>
            <Route path="/basic-tracker" element={<BasicTracker />} />
            <Route path="/advanced-simulation" element={<AdvancedSimulation />} />
            <Route path="/market-orders" element={<MarketOrders />} />
            <Route path="/" element={<BasicTracker />} /> 
          </Routes>
        </div>
      </div>
    </Router>
  );
}
export default App;