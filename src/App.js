import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Ticker from './components/Ticker';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import HeroNews from './components/HeroNews';
import NewsCard from './components/NewsCard';
import Footer from './components/Footer';

function App() {
  const [news, setNews] = useState([]);
  const [category, setCategory] = useState("general");
  const [language, setLanguage] = useState("en");
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      setErrorMsg("");
      try {
        // Have direct GNews nahi, pan aapana Vercel backend proxy ne call karshu
        let url = `/api/news?category=${category}&lang=${language}`;
        
        // Jo user search kare, to query parameter badli nakhiye
        if (search) {
          url = `/api/news?search=${encodeURIComponent(search)}&lang=${language}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        
        if (data.articles) {
          if (data.articles.length === 0) {
            setNews([]);
            setErrorMsg("No news found for this language or category.");
          } else {
            setNews(data.articles);
          }
        } else if (data.errors) {
          setNews([]);
          setErrorMsg(data.errors[0] || "API Limit reached for today.");
        }
      } catch (error) {
        console.error(error);
        setNews([]);
        setErrorMsg("Network error. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchNews();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [category, language, search]);

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', darkMode ? 'dark' : 'light');
    document.body.style.backgroundColor = darkMode ? '#121212' : '#f9fafb';
    document.body.style.color = darkMode ? '#ffffff' : '#000000';
  }, [darkMode]);

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Ticker />
      <Navbar 
        category={category} 
        setCategory={setCategory} 
        language={language} 
        setLanguage={setLanguage} 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
      />
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
        <SearchBar search={search} setSearch={setSearch} />
        
        {isLoading ? (
          <div className="text-center mt-5">
            <h4>Loading News...</h4>
          </div>
        ) : errorMsg ? (
          <div className="text-center mt-5 text-danger">
            <h4>{errorMsg}</h4>
            <p>Try switching to English or General category.</p>
          </div>
        ) : (
          <>
            <div style={{ marginTop: '20px' }}>
              {news.length > 0 && <HeroNews article={news[0]} />}
            </div>

            <div style={{ marginTop: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', borderBottom: '3px solid #3b82f6', display: 'inline-block', paddingBottom: '5px', marginBottom: '20px' }}>
                Latest {category.charAt(0).toUpperCase() + category.slice(1)} News
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
      <Footer />
    </div>
  );
}

export default App;