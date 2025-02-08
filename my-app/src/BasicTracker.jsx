import { useState, useEffect } from 'react';
import './style/BasicTracker.css';

function BasicTracker() {
  
  const [portfolio, setPortfolio] = useState([]);
  const [assetName, setAssetName] = useState('');
  const [assetSymbol, setAssetSymbol] = useState('');

  
  const addAsset = () => {
    if (!assetName.trim() || !assetSymbol.trim()) {
      alert("Please enter both asset name and symbol.");
      return;
    }
    
    if (portfolio.find(item => item.symbol.toLowerCase() === assetSymbol.trim().toLowerCase())) {
      alert("Asset already in your portfolio!");
      return;
    }
    
    const randomPerformance = (Math.random() * 20 - 10).toFixed(2);
    const newAsset = {
      id: Date.now(), 
      name: assetName,
      symbol: assetSymbol.toUpperCase(),
      performance: randomPerformance
    };
    setPortfolio([...portfolio, newAsset]);
    setAssetName('');
    setAssetSymbol('');
  };

 
  const removeAsset = (id) => {
    setPortfolio(portfolio.filter(asset => asset.id !== id));
  };

  
  useEffect(() => {
    const interval = setInterval(() => {
      setPortfolio(prevPortfolio =>
        prevPortfolio.map(asset => ({
          ...asset,
          performance: (Math.random() * 20 - 10).toFixed(2)
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="basic-tracker">
      <h1>Basic Portfolio Tracker</h1>
      <div className="input-section">
        <input
          type="text"
          placeholder="Asset Name (e.g., Apple)"
          value={assetName}
          onChange={(e) => setAssetName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Asset Symbol (e.g., AAPL)"
          value={assetSymbol}
          onChange={(e) => setAssetSymbol(e.target.value)}
        />
        <button onClick={addAsset}>Add Asset</button>
      </div>
      
      <div className="portfolio">
        <h2>Your Portfolio</h2>
        {portfolio.length === 0 ? (
          <p>No assets added yet.</p>
        ) : (
          <ul>
            {portfolio.map(asset => (
              <li key={asset.id}>
                <span>
                  {asset.name} ({asset.symbol}) – Performance: {asset.performance}%
                </span>
                <button onClick={() => removeAsset(asset.id)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default BasicTracker;
