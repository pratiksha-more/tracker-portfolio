// import './style/AdvancedSimulator.css';

// function AdvancedSimulation() {
//   return (
//     <div className="advanced-simulation">

//     </div>
//   );
// }

// export default AdvancedSimulation;

import { useState } from "react";
import "./style/AdvancedSimulator.css";

function AdvancedSimulation() {
  const initialStocks = [
    { id: 1, name: "Apple", symbol: "AAPL", price: 150.0 },
    { id: 2, name: "Google", symbol: "GOOGL", price: 2800.0 },
    { id: 3, name: "Amazon", symbol: "AMZN", price: 3500.0 },
    { id: 4, name: "Microsoft", symbol: "MSFT", price: 300.0 },
  ];

  const [stocks, setStocks] = useState(initialStocks);
  const [portfolio, setPortfolio] = useState([]);
  const [cash, setCash] = useState(10000);

  const [selectedStockId, setSelectedStockId] = useState("");
  const [tradeQuantity, setTradeQuantity] = useState("");
  const [tradeAction, setTradeAction] = useState("buy");

  const buyStock = () => {
    const stock = stocks.find((s) => s.id === Number(selectedStockId));
    if (!stock) {
      alert("Please select a valid stock to buy.");
      return;
    }
    const qty = Number(tradeQuantity);
    if (qty <= 0) {
      alert("Enter a valid quantity to buy.");
      return;
    }
    const cost = stock.price * qty;
    if (cash < cost) {
      alert("Not enough cash.");
      return;
    }

    setCash((prevCash) => prevCash - cost);

    const existingHolding = portfolio.find((p) => p.id === stock.id);
    if (existingHolding) {
      const newQuantity = existingHolding.quantity + qty;
      const newAvgCost =
        (existingHolding.avgCost * existingHolding.quantity + cost) /
        newQuantity;
      setPortfolio(
        portfolio.map((p) =>
          p.id === stock.id
            ? { ...p, quantity: newQuantity, avgCost: newAvgCost }
            : p
        )
      );
    } else {
      setPortfolio([
        ...portfolio,
        {
          id: stock.id,
          name: stock.name,
          symbol: stock.symbol,
          quantity: qty,
          avgCost: stock.price,
        },
      ]);
    }
  };

  const sellStock = () => {
    const stock = stocks.find((s) => s.id === Number(selectedStockId));
    if (!stock) {
      alert("Please select a valid stock to sell.");
      return;
    }
    const qty = Number(tradeQuantity);
    if (qty <= 0) {
      alert("Enter a valid quantity to sell.");
      return;
    }
    const holding = portfolio.find((p) => p.id === stock.id);
    if (!holding || holding.quantity < qty) {
      alert("Not enough shares to sell.");
      return;
    }
    const revenue = stock.price * qty;
    setCash((prevCash) => prevCash + revenue);
    if (holding.quantity === qty) {
      setPortfolio(portfolio.filter((p) => p.id !== stock.id));
    } else {
      setPortfolio(
        portfolio.map((p) =>
          p.id === stock.id ? { ...p, quantity: p.quantity - qty } : p
        )
      );
    }
  };

  const refreshPrices = () => {
    const updatedStocks = stocks.map((stock) => {
      const changePercent = Math.random() * 10 - 5;
      const newPrice = +(stock.price * (1 + changePercent / 100)).toFixed(2);
      return { ...stock, price: newPrice };
    });
    setStocks(updatedStocks);
  };

  const portfolioValue =
    cash +
    portfolio.reduce((acc, holding) => {
      const stock = stocks.find((s) => s.id === holding.id);
      const currentValue = stock ? stock.price * holding.quantity : 0;
      return acc + currentValue;
    }, 0);

  return (
    <div className="advanced-simulation">
      <h1>Advanced Portfolio Simulation</h1>
      <div className="balance">
        <p>Cash Balance: ${cash.toFixed(2)}</p>
        <p>Total Portfolio Value: ${portfolioValue.toFixed(2)}</p>
      </div>
      <div className="controls">
        <h2>Trade</h2>
        <div className="option">

          <div className="options">
          <select
            value={selectedStockId}
            onChange={(e) => setSelectedStockId(e.target.value)}
          >
            <option value="">Select Stock</option>
            {stocks.map((stock) => (
              <option key={stock.id} value={stock.id}>
                {stock.name} ({stock.symbol}) - ${stock.price.toFixed(2)}
              </option>
            ))}
          </select>
          <br></br>

          <input
            type="number"
            placeholder="Quantity"
            value={tradeQuantity}
            onChange={(e) => setTradeQuantity(e.target.value)}
          />
          <br />
          <select
            value={tradeAction}
            onChange={(e) => setTradeAction(e.target.value)}
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
          </div>

          <button onClick={tradeAction === "buy" ? buyStock : sellStock}>
            {tradeAction === "buy" ? "Buy" : "Sell"}
          </button>

        </div>

        <button className="refreshbtn" onClick={refreshPrices}>Refresh Prices</button>
      </div>
      <div className="portfolio-section">
        <h2>Your Holdings</h2>
        {portfolio.length === 0 ? (
          <p>No holdings yet.</p>
        ) : (
          <ul>
            {portfolio.map((holding) => {
              const stock = stocks.find((s) => s.id === holding.id);
              const currentPrice = stock ? stock.price : holding.avgCost;
              const currentValue = currentPrice * holding.quantity;
              const profitLoss = (
                (currentPrice - holding.avgCost) *
                holding.quantity
              ).toFixed(2);
              return (
                <li key={holding.id}>
                  <strong>
                    {holding.name} ({holding.symbol})
                  </strong>
                  <br />
                  Quantity: {holding.quantity} | Avg. Cost: $
                  {holding.avgCost.toFixed(2)}
                  <br />
                  Current Price: ${currentPrice.toFixed(2)} | Value: $
                  {currentValue.toFixed(2)}
                  <br />
                  Profit/Loss: ${profitLoss}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AdvancedSimulation;
