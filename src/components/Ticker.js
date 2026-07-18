import React, { useState, useEffect } from 'react';
import './Ticker.css';

const Ticker = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        // 1. Live Crypto Data (CoinGecko API - No API Key required!)
        const cryptoRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true');
        const cryptoLive = await cryptoRes.json();

        // 2. Mock Indian/World Data (Karan ke free API nathi aavat)
        const mockIndianStocks = [
          { symbol: "SENSEX", price: "80,120.50", change: "+0.8%", isUp: true },
          { symbol: "NIFTY 50", price: "24,530.00", change: "+0.6%", isUp: true },
          { symbol: "RELIANCE", price: "3,150.45", change: "-0.1%", isUp: false },
          { symbol: "TCS", price: "4,225.10", change: "+1.2%", isUp: true },
          { symbol: "HDFC BANK", price: "1,670.00", change: "+0.5%", isUp: true },
          { symbol: "NASDAQ", price: "18,200.50", change: "+1.1%", isUp: true },
        ];

        // 3. Banne data ne mix kariye
        const finalData = [
          ...mockIndianStocks,
          // Live Crypto array ma add karyo
          { 
            symbol: "BITCOIN (LIVE)", 
            price: `$${cryptoLive.bitcoin.usd.toLocaleString()}`, 
            change: `${cryptoLive.bitcoin.usd_24h_change.toFixed(2)}%`, 
            isUp: cryptoLive.bitcoin.usd_24h_change > 0 
          },
          { 
            symbol: "ETHEREUM (LIVE)", 
            price: `$${cryptoLive.ethereum.usd.toLocaleString()}`, 
            change: `${cryptoLive.ethereum.usd_24h_change.toFixed(2)}%`, 
            isUp: cryptoLive.ethereum.usd_24h_change > 0 
          }
        ];

        setStockData(finalData);
        setLoading(false);
      } catch (error) {
        console.error("Live Data fetch error:", error);
        setLoading(false);
      }
    };

    fetchMarketData();
    
    // Har 2 minute (120000ms) pachi live crypto data refresh thase
    const interval = setInterval(fetchMarketData, 120000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ticker-container">
      {loading ? (
        <span className="ticker-item" style={{ paddingLeft: '20px' }}>Loading Live Market...</span>
      ) : (
        <div className="ticker-track">
          {/* Seamless loop mate data double karyo */}
          {[...stockData, ...stockData].map((stock, index) => (
            <span key={index} className="ticker-item">
              <span className="symbol">{stock.symbol}:</span>
              <span className="price">{stock.price}</span>
              <span className={`change ${stock.isUp ? 'text-up' : 'text-down'}`}>
                {stock.isUp ? '▲' : '▼'} {stock.change}
              </span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Ticker;