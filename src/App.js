import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import AppNavbar from './components/Navbar';
import NewsCard from './components/NewsCard';
import SubmitNews from './components/SubmitNews';
import AdminPanel from './components/AdminPanel';
import AskNewsChat from './components/AskNewsChat';

// 🔑 Your New Fresh GNews API Key
const GNEWS_API_KEY = "700109c3b2c10f2cd490f40d7c002bab";

// Dynamic Unique Image Fallback Engine
const getUniqueImage = (item, index) => {
  if (item.image && item.image.startsWith('http')) return item.image;
  if (item.urlToImage && item.urlToImage.startsWith('http')) return item.urlToImage;
  
  const photoIds = [
    "1504711434969-e33886168f5c",
    "1518770660439-4636190af475",
    "1611974789855-9c2a0a7236a3",
    "1509391365360-2e959784a276",
    "1461896836934-ffe607ba8211",
    "1526374965328-7f61d4dc18c5",
    "1495020689067-958852a7765e",
    "1585829365295-ab7cd400c167"
  ];
  return `https://images.unsplash.com/photo-${photoIds[index % photoIds.length]}?q=80&w=600&auto=format&fit=crop`;
};

function NewsFeed({ newsList, setNewsList, language }) {
  const { categoryName } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const currentCategory = categoryName || 'general';

  useEffect(() => {
    setLoading(true);

    let categoryForApi = currentCategory.toLowerCase();
    if (categoryForApi === 'tech') categoryForApi = 'technology';

    let gnewsUrl = "";
    if (searchTerm.trim().length > 0) {
      gnewsUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(searchTerm.trim())}&lang=${language}&max=12&apikey=${GNEWS_API_KEY}`;
    } else {
      gnewsUrl = `https://gnews.io/api/v4/top-headlines?category=${categoryForApi}&lang=${language}&max=12&apikey=${GNEWS_API_KEY}`;
    }

    const timer = setTimeout(() => {
      fetch(gnewsUrl)
        .then((res) => {
          if (!res.ok) throw new Error(`API Error: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          let apiArticles = [];
          if (data && data.articles && data.articles.length > 0) {
            apiArticles = data.articles.map((item, index) => ({
              id: `api-${index + 1}`,
              title: item.title,
              description: item.description || 'Latest news update.',
              category: currentCategory,
              author: item.source?.name || 'GNews Desk',
              image: getUniqueImage(item, index),
              url: item.url
            }));
          }

          const localApproved = JSON.parse(localStorage.getItem('approvedNews') || '[]');
          const matchedApproved = localApproved.filter(item => 
            currentCategory === 'general' || item.category?.toLowerCase() === currentCategory.toLowerCase()
          );

          setNewsList([...matchedApproved, ...apiArticles]);
          setLoading(false);
        })
        .catch((err) => {
          console.error("GNews API fetch error:", err);
          // Fallback to Google News RSS Feed if limit hit
          const rssUrl = `https://news.google.com/rss?hl=${language}&gl=IN&ceid=IN:${language}`;
          const rss2jsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

          fetch(rss2jsonUrl)
            .then(res => res.json())
            .then(rssData => {
              const rssArticles = (rssData.items || []).slice(0, 10).map((item, index) => ({
                id: `rss-${index + 1}`,
                title: item.title,
                description: item.description ? item.description.replace(/<[^>]*>?/gm, '').substring(0, 120) + '...' : 'Live update',
                category: currentCategory,
                author: item.author || 'Google News',
                image: getUniqueImage(item, index),
                url: item.link
              }));

              const localApproved = JSON.parse(localStorage.getItem('approvedNews') || '[]');
              setNewsList([...localApproved, ...rssArticles]);
              setLoading(false);
            })
            .catch(() => setLoading(false));
        });
    }, 400);

    return () => clearTimeout(timer);
  }, [currentCategory, language, searchTerm, setNewsList]);

  const heroArticle = newsList.length > 0 ? newsList[0] : null;
  const gridArticles = newsList.length > 1 ? newsList.slice(1) : [];

  return (
    <div className="container my-4">
      <div className="mb-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <input 
          type="text" 
          className="form-control form-control-lg shadow-sm rounded-pill px-4 fs-6" 
          placeholder="🔍 Search live news or topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted fw-bold">Fetching Live News...</p>
        </div>
      ) : newsList.length === 0 ? (
        <div className="text-center py-5 text-muted card shadow-sm border-0 p-5 my-4">
          <h5>🔍 No news articles found right now.</h5>
        </div>
      ) : (
        <>
          {heroArticle && (
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden mb-5">
              <div className="row g-0 align-items-center">
                <div className="col-md-7">
                  <img 
                    src={heroArticle.image} 
                    alt={heroArticle.title} 
                    className="img-fluid w-100" 
                    style={{ height: '340px', objectFit: 'cover' }}
                  />
                </div>
                <div className="col-md-5 p-4">
                  <span className="badge bg-danger mb-2 px-3 py-2 uppercase fw-bold">🔥 Breaking News</span>
                  <h3 className="fw-bold mb-3">{heroArticle.title}</h3>
                  <p className="text-secondary mb-4">{heroArticle.description}</p>
                  <a href={heroArticle.url || "#"} target="_blank" rel="noreferrer" className="btn btn-primary fw-bold px-4 py-2 rounded-pill">
                    Read Full Article
                  </a>
                </div>
              </div>
            </div>
          )}

          <h3 className="fw-bold mb-4 border-start border-4 border-primary ps-3">
            {searchTerm.trim() ? `Search Results for "${searchTerm}"` : `Latest ${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)} News`}
          </h3>

          <div className="row g-4">
            {gridArticles.map((article, idx) => (
              <div className="col-md-6 col-lg-4" key={article.id || idx}>
                <NewsCard article={article} language={language} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function SavedNews({ language }) {
  const [savedItems, setSavedItems] = useState([]);

  const refreshSaved = () => {
    const saved = JSON.parse(localStorage.getItem('savedNews') || '[]');
    setSavedItems(saved);
  };

  useEffect(() => {
    refreshSaved();
    window.addEventListener('savedNewsChanged', refreshSaved);
    return () => window.removeEventListener('savedNewsChanged', refreshSaved);
  }, []);

  return (
    <div className="container my-5">
      <h3 className="fw-bold mb-4">🔖 Saved Articles ({savedItems.length})</h3>
      {savedItems.length === 0 ? (
        <div className="text-center py-5 text-muted card shadow-sm border-0 p-5">
          <h5>No bookmarked articles yet.</h5>
        </div>
      ) : (
        <div className="row g-4">
          {savedItems.map((article, idx) => (
            <div className="col-md-6 col-lg-4" key={article.id || idx}>
              <NewsCard article={article} language={language} onSaveToggle={refreshSaved} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function App() {
  const [news, setNews] = useState([]);
  const [language, setLanguage] = useState('en');
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "bg-dark text-white min-vh-100" : "bg-light text-dark min-vh-100"} style={{ transition: 'all 0.3s' }}>
      <Router>
        <AppNavbar 
          language={language} 
          setLanguage={setLanguage} 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
          newsList={news}
        />

        <Routes>
          <Route path="/" element={<NewsFeed newsList={news} setNewsList={setNews} language={language} />} />
          <Route path="/category/:categoryName" element={<NewsFeed newsList={news} setNewsList={setNews} language={language} />} />
          <Route path="/saved" element={<SavedNews language={language} />} />
          <Route path="/submit-news" element={<SubmitNews />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
        
        <AskNewsChat newsList={news} />

        <footer className="text-center py-4 border-top mt-5 text-muted small">
          <p className="mb-0">© 2026 G-News Platform. All rights reserved.</p>
          <p className="fw-bold text-primary mb-0">Developed by Tejas😎</p>
        </footer>
      </Router>
    </div>
  );
}

export default App;