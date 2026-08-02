import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Ticker from './components/Ticker';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import HeroNews from './components/HeroNews';
import NewsCard from './components/NewsCard';
import Footer from './components/Footer';
import SubmitNews from './components/SubmitNews';
import AdminPanel from './components/AdminPanel';
import SavedNews from './components/SavedNews';

// Backup Mock News (Agar API Limit Puru thai jaay to site khali na lage)
const fallbackNews = [
  {
    title: "India Advances Big in AI & Space Technology Innovations",
    description: "Indian tech startups and research institutes achieve major breakthroughs in artificial intelligence and space exploration projects this year.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop",
    url: "https://google.com"
  },
  {
    title: "Global Stock Markets Show Positive Growth in Q3",
    description: "Financial markets across major economies see steady upward trend driven by tech stocks and strong quarterly corporate earnings.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=600&auto=format&fit=crop",
    url: "https://google.com"
  },
  {
    title: "Major Breakthrough in Renewable Solar Energy Storage",
    description: "Engineers develop high-efficiency batteries that dramatically increase the storage capacity for solar and wind energy grids.",
    image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=600&auto=format&fit=crop",
    url: "https://google.com"
  },
  {
    title: "National Sports Championship Highlights Emerging Young Talent",
    description: "Young athletes set unprecedented national records in track and field events during the annual national championship series.",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=600&auto=format&fit=crop",
    url: "https://google.com"
  }
];

function NewsFeed({ language, search, setSearch }) {
  const { categoryName } = useParams();
  const currentCategory = categoryName || "general";

  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      let userApprovedNews = [];

      // 1. Fetch Local User Approved News (Khali Localhost/Development ma j request jase)
      if (window.location.hostname === "localhost") {
        try {
          const userNewsRes = await fetch('http://localhost:5000/api/user-news');
          if (userNewsRes.ok) {
            userApprovedNews = await userNewsRes.json();
          }
        } catch (e) {
          console.log("Backend offline or local fetch skipped");
        }
      }

      // 2. Fetch External API News
      try {
        let url = `https://gnews.io/api/v4/top-headlines?category=${currentCategory}&lang=${language}&country=in&max=10&apikey=b890dfdbc88d6283fbd54075e88eccaa`;
        
        if (search) {
          url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(search)}&lang=${language}&country=in&max=10&apikey=b890dfdbc88d6283fbd54075e88eccaa`;
        }

        const response = await fetch(url);
        const data = await response.json();
        
        if (data && data.articles && data.articles.length > 0) {
          const filteredUserNews = userApprovedNews.filter(n => n.category === currentCategory || currentCategory === 'general');
          setNews([...filteredUserNews, ...data.articles]);
        } else {
          // If API Limit Reached, Use Fallback
          setNews([...userApprovedNews, ...fallbackNews]);
        }
      } catch (error) {
        console.error("API Fetch Error:", error);
        setNews([...userApprovedNews, ...fallbackNews]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [currentCategory, language, search]);

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      <SearchBar search={search} setSearch={setSearch} />
      
      {isLoading ? (
        <div className="text-center mt-5">
          <h4>Loading Latest News...</h4>
        </div>
      ) : (
        <>
          {news.length > 0 && <HeroNews article={news[0]} />}

          <div style={{ marginTop: '40px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', borderBottom: '3px solid #3b82f6', display: 'inline-block', paddingBottom: '5px', marginBottom: '20px' }}>
              Latest {currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)} News
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {news.slice(1).map((article, index) => (
                <NewsCard key={index} article={article} />
              ))}
            </div>
          </div>
        </>
      )}
    </main>
  );
}

function App() {
  const [language, setLanguage] = useState("en");
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', darkMode ? 'dark' : 'light');
    document.body.style.backgroundColor = darkMode ? '#121212' : '#f9fafb';
    document.body.style.color = darkMode ? '#ffffff' : '#000000';
  }, [darkMode]);

  return (
    <Router>
      <div style={{ minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <Ticker />
        <Navbar 
          language={language} 
          setLanguage={setLanguage} 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
        />

        <Routes>
          <Route path="/" element={<NewsFeed language={language} search={search} setSearch={setSearch} />} />
          <Route path="/category/:categoryName" element={<NewsFeed language={language} search={search} setSearch={setSearch} />} />
          <Route path="/submit-news" element={<SubmitNews />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/saved" element={<SavedNews />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;