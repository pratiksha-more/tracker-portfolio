import { useState, useEffect } from 'react';
import './style/MarketOrders.css';

function MarketOrders() {
  const initialStocks = [
    { id: 1, name: 'Apple', symbol: 'AAPL', price: 150.0 },
    { id: 2, name: 'Google', symbol: 'GOOGL', price: 2800.0 },
    { id: 3, name: 'Amazon', symbol: 'AMZN', price: 3500.0 },
    { id: 4, name: 'Microsoft', symbol: 'MSFT', price: 300.0 },
  ];

  const [stocks, setStocks] = useState(initialStocks);
  const [orders, setOrders] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [cash, setCash] = useState(10000); // line number 28

  const [selectedStockId, setSelectedStockId] = useState('');
  const [orderType, setOrderType] = useState('market');
  const [quantity, setQuantity] = useState('');
  const [limitPrice, setLimitPrice] = useState('');

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     refreshPrices();
  //     processOrders();
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, [orders.length, stocks.length]);

  // const refreshPrices = () => {
  //   const updatedStocks = stocks.map((stock) => {
  //     const changePercent = Math.random() * 10 - 5;
  //     const newPrice = +(stock.price * (1 + changePercent / 100)).toFixed(2);
  //     return { ...stock, price: newPrice };
  //   });
  //   setStocks(updatedStocks);
  // };

  useEffect(() => {
    const interval = setInterval(() => {
      refreshPrices();
      processOrders();
    }, 5000);
    return () => clearInterval(interval);
  }, [orders.length, stocks.length, processOrders, refreshPrices]);

  const refreshPrices = () => {
    const updatedStocks = stocks.map((stock) => {
      const changePercent = Math.random() * 10 - 5;
      const newPrice = +(stock.price * (1 + changePercent / 100)).toFixed(2);
      return { ...stock, price: newPrice };
    });
    setStocks(updatedStocks);
  };

  const processOrders = () => {
    const executedOrders = [];
    const remainingOrders = [];

    orders.forEach((order) => {
      const stock = stocks.find((s) => s.id === order.stockId);
      if (!stock) return;

      if (
        (order.type === 'market') ||
        (order.type === 'limit' && ((order.action === 'buy' && stock.price <= order.limitPrice) ||
                                    (order.action === 'sell' && stock.price >= order.limitPrice)))
      ) {
        executeOrder(order, stock.price);
        executedOrders.push(order);
      } else {
        remainingOrders.push(order);
      }
    });

    setOrders(remainingOrders);
  };

  const executeOrder = (order, executionPrice) => {
    const cost = executionPrice * order.quantity;

    if (order.action === 'buy') {
      if (cash < cost) {
        alert('Not enough cash to execute the buy order.');
        return;
      }
      setCash((prevCash) => prevCash - cost);
      const existingHolding = portfolio.find((p) => p.id === order.stockId);
      if (existingHolding) {
        const newQuantity = existingHolding.quantity + order.quantity;
        const newAvgCost =
          (existingHolding.avgCost * existingHolding.quantity + cost) /
          newQuantity;
        setPortfolio(
          portfolio.map((p) =>
            p.id === order.stockId
              ? { ...p, quantity: newQuantity, avgCost: newAvgCost }
              : p
          )                   
        );
      } else {
        const stock = stocks.find((s) => s.id === order.stockId);
        setPortfolio([
          ...portfolio,
          {
            id: stock.id,
            name: stock.name,
            symbol: stock.symbol,
            quantity: order.quantity,
            avgCost: executionPrice,
          },
        ]);
      }
    } else if (order.action === 'sell') {
      const holding = portfolio.find((p) => p.id === order.stockId);
      if (!holding || holding.quantity < order.quantity) {
        alert('Not enough shares to execute the sell order.');
        return;
      }
      setCash((prevCash) => prevCash + cost);
      if (holding.quantity === order.quantity) {
        setPortfolio(portfolio.filter((p) => p.id !== order.stockId));
      } else {
        setPortfolio(
          portfolio.map((p) =>
            p.id === order.stockId
              ? { ...p, quantity: p.quantity - order.quantity }
              : p
          )
        );
      }
    }
  };

  const placeOrder = () => {
    if (!selectedStockId || !quantity || quantity <= 0) {
      alert('Please select a stock and enter a valid quantity.');
      return;
    }

    if (orderType === 'limit' && (!limitPrice || limitPrice <= 0)) {
      alert('Please enter a valid limit price.');
      return;
    }

    const newOrder = {
      id: Date.now(),
      stockId: Number(selectedStockId),
      type: orderType,
      action: orderType === 'market' ? 'buy' : 'sell',
      quantity: Number(quantity),
      limitPrice: orderType === 'limit' ? Number(limitPrice) : null,
    };

    if (orderType === 'market') {
      const stock = stocks.find((s) => s.id === newOrder.stockId);
      executeOrder(newOrder, stock.price);
    } else {
      setOrders([...orders, newOrder]);
    }

    setSelectedStockId('');
    setOrderType('market');
    setQuantity('');
    setLimitPrice('');
  };

  return (
    <div className="market-orders">
      <h1>Simulated Market Orders</h1>
      <div className="balance">
        <p>Cash Balance: ${cash.toFixed(2)}</p>
      </div>
      <div className="controls">
        <h2>Place Order</h2>
        <div className="order-form">
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
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            >
            <option value="market">Market Order</option>
            <option value="limit">Limit Order</option>
          </select>
          {orderType === 'limit' && (
            <input
              type="number"
              placeholder="Limit Price"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
            />
          )}
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <button onClick={placeOrder}>Place Order</button>
        </div>
      </div>
      <div className="portfolio">
        <h2>Portfolio</h2>
        {portfolio.length === 0 ? (
          <p>No stocks in portfolio</p>
        ) : (
          <ul>
            {portfolio.map((stock) => (
              <li key={stock.id}>
                {stock.name} ({stock.symbol}) - {stock.quantity} shares @ $
                {stock.avgCost.toFixed(2)}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="pending-orders">
        <h2>Pending Orders</h2>
        {orders.length === 0 ? (
          <p>No pending orders</p>
        ) : (
          <ul>
            {orders.map((order) => (
              <li key={order.id}>
                {order.action.toUpperCase()} {order.quantity} shares of{' '}
                {stocks.find((s) => s.id === order.stockId)?.symbol} at{' '}
                {order.type === 'limit'
                  ? `$${order.limitPrice.toFixed(2)}`
                  : 'Market Price'}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
); }

export default MarketOrders;
