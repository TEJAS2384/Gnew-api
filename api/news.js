export default async function handler(req, res) {
  // Tamari API Key ahiya secure thay gayi
  const API_KEY = process.env.REACT_APP_NEWS_API_KEY || 'b890dfdbc88d6283fbd54075e88eccaa';
  
  const category = req.query.category || 'general'; 
  const language = req.query.lang || 'en';
  const search = req.query.search || '';

  // Jo search value hoy to search endpoint hit thase, nai to top-headlines
  let url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=${language}&country=in&max=10&apikey=${b890dfdbc88d6283fbd54075e88eccaa}`;

  if (search) {
    url = `https://gnews.io/api/v4/search?q=${search}&lang=${language}&country=in&max=10&apikey=${b890dfdbc88d6283fbd54075e88eccaa}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    // CORS error fix na headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error, news nathi aavi rahi.' });
  }
}