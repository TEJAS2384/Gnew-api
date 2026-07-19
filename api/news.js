const https = require('https');

module.exports = function (req, res) {
  // CORS Error Fix na headers sauthi pela
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  // Tamari API Key
  const API_KEY = process.env.REACT_APP_NEWS_API_KEY || 'b890dfdbc88d6283fbd54075e88eccaa';
  
  const category = req.query.category || 'general'; 
  const language = req.query.lang || 'en';
  const search = req.query.search || '';

  let url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=${language}&country=in&max=10&apikey=${API_KEY}`;

  if (search) {
    url = `https://gnews.io/api/v4/search?q=${search}&lang=${language}&country=in&max=10&apikey=${API_KEY}`;
  }

  // Pure Node.js Backend Code - je Vercel par kyarey crash nai thay
  https.get(url, (apiRes) => {
    let data = '';

    // Data aavta jay em collect karo
    apiRes.on('data', (chunk) => {
      data += chunk;
    });

    // Data aavvano puro thay pachi send karo
    apiRes.on('end', () => {
      try {
        res.status(200).json(JSON.parse(data));
      } catch (error) {
        res.status(500).json({ error: 'Data parsing ma error aavi' });
      }
    });

  }).on('error', (error) => {
    res.status(500).json({ error: 'Server error, news nathi aavi rahi.' });
  });
};