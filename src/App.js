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

function NewsFeed({ language, search, setSearch }) {
  const { categoryName } = useParams();
  const currentCategory = categoryName || "general";

  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        // 1. Live Express Backend Server mathi approved news fetch kar
        let approvedUserNews = [];
        try {
          const userNewsRes = await fetch('http://localhost:5000/api/user-news');
          if (userNewsRes.ok) {
            approvedUserNews = await userNewsRes.json();
          }
        } catch (e) {
          console.log("Server fetch fallback");
        }

        // 2. External GNews API Fetch
        const url = `https://gnews.io/api/v4/top-headlines?category=${currentCategory}&lang=${language}&country=in&max=10&apikey=b890dfdbc88d6283fbd54075e88eccaa`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.articles) {
          const filteredUserNews = approvedUserNews.filter(n => n.category === currentCategory || currentCategory === 'general');
          setNews([...filteredUserNews, ...data.articles]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [currentCategory, language]);

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      <SearchBar search={search} setSearch={setSearch} />
      
      {isLoading ? (
        <div className="text-center mt-5">
          <h4>Loading News...</h4>
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