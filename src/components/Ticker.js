import React, { useState, useEffect } from 'react';
import './Ticker.css';

const Ticker = () => {
  const [userCity, setUserCity] = useState(localStorage.getItem('userCity') || 'Ahmedabad');
  const [stockData, setStockData] = useState([
    { symbol: `🌤️ WEATHER (${(localStorage.getItem('userCity') || 'AHMEDABAD').toUpperCase()})`, price: "32°C", change: "LIVE", isUp: true },
    { symbol: "SENSEX", price: "80,120.50", change: "+0.8%", isUp: true },
    { symbol: "NIFTY 50", price: "24,530.00", change: "+0.6%", isUp: true },
    { symbol: "RELIANCE", price: "3,150.45", change: "-0.1%", isUp: false },
    { symbol: "TCS", price: "4,225.10", change: "+1.2%", isUp: true },
    { symbol: "BITCOIN (LIVE)", price: "$64,200", change: "+2.1%", isUp: true },
    { symbol: "ETHEREUM (LIVE)", price: "$3,450", change: "+1.5%", isUp: true }
  ]);

  useEffect(() => {
    const handleCityChange = () => {
      setUserCity(localStorage.getItem('userCity') || 'Ahmedabad');
    };
    window.addEventListener('cityChanged', handleCityChange);
    return () => window.removeEventListener('cityChanged', handleCityChange);
  }, []);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        let currentTemp = "32°C";
        try {
          const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(userCity)}&count=1&language=en&format=json`);
          const geoData = await geoRes.json();
          if (geoData.results && geoData.results.length > 0) {
            const { latitude, longitude } = geoData.results[0];
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
            const weatherLive = await weatherRes.json();
            if (weatherLive?.current_weather?.temperature !== undefined) {
              currentTemp = `${Math.round(weatherLive.current_weather.temperature)}°C`;
            }
          }
        } catch (e) {
          console.log("Weather fetch fallback");
        }

        let btcPrice = "$64,200";
        let btcChange = "+2.1%";
        let btcUp = true;
        let ethPrice = "$3,450";
        let ethChange = "+1.5%";
        let ethUp = true;

        try {
          const cryptoRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true');
          const cryptoLive = await cryptoRes.json();
          if (cryptoLive?.bitcoin) {
            btcPrice = `$${cryptoLive.bitcoin.usd.toLocaleString()}`;
            btcChange = `${cryptoLive.bitcoin.usd_24h_change >= 0 ? '+' : ''}${cryptoLive.bitcoin.usd_24h_change.toFixed(2)}%`;
            btcUp = cryptoLive.bitcoin.usd_24h_change >= 0;
          }
          if (cryptoLive?.ethereum) {
            ethPrice = `$${cryptoLive.ethereum.usd.toLocaleString()}`;
            ethChange = `${cryptoLive.ethereum.usd_24h_change >= 0 ? '+' : ''}${cryptoLive.ethereum.usd_24h_change.toFixed(2)}%`;
            ethUp = cryptoLive.ethereum.usd_24h_change >= 0;
          }
        } catch (e) {
          console.log("Crypto fetch fallback");
        }

        setStockData([
          { symbol: `🌤️ WEATHER (${userCity.toUpperCase()})`, price: currentTemp, change: "LIVE", isUp: true },
          { symbol: "SENSEX", price: "80,120.50", change: "+0.8%", isUp: true },
          { symbol: "NIFTY 50", price: "24,530.00", change: "+0.6%", isUp: true },
          { symbol: "RELIANCE", price: "3,150.45", change: "-0.1%", isUp: false },
          { symbol: "TCS", price: "4,225.10", change: "+1.2%", isUp: true },
          { symbol: "BITCOIN (LIVE)", price: btcPrice, change: btcChange, isUp: btcUp },
          { symbol: "ETHEREUM (LIVE)", price: ethPrice, change: ethChange, isUp: ethUp }
        ]);
      } catch (error) {
        console.error("Live Data fetch error:", error);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 120000);
    return () => clearInterval(interval);
  }, [userCity]);

  return (
    <div className="ticker-container">
      <div className="ticker-track">
        {[...stockData, ...stockData].map((stock, index) => (
          <span key={index} className="ticker-item">
            <span className="symbol">{stock.symbol}:</span>
            <span className="price">{stock.price}</span>
            <span className={`change ${stock.isUp ? 'text-up' : 'text-down'}`}>
              {stock.change === 'LIVE' ? '🟢' : stock.isUp ? '▲' : '▼'} {stock.change}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Ticker;