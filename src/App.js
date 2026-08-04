import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import AppNavbar from './components/Navbar';
import NewsCard from './components/NewsCard';
import SubmitNews from './components/SubmitNews';
import AdminPanel from './components/AdminPanel';
import AskNewsChat from './components/AskNewsChat';

const GNEWS_API_KEY = "700109c3b2c10f2cd490f40d7c002bab";

// 🖼️ Category-Specific Dynamic Image Engine
const getUniqueImage = (item, category, index) => {
  if (item.image && item.image.startsWith('http')) return item.image;
  if (item.urlToImage && item.urlToImage.startsWith('http')) return item.urlToImage;
  
  const categoryImages = {
    tech: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop"
    ],
    business: [
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop"
    ],
    science: [
      "https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=600&auto=format&fit=crop"
    ],
    sports: [
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517649763962-0c623266010b?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=600&auto=format&fit=crop"
    ],
    health: [
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=600&auto=format&fit=crop"
    ],
    world: [
      "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600&auto=format&fit=crop"
    ],
    general: [
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=600&auto=format&fit=crop"
    ]
  };

  const catKey = (category || 'general').toLowerCase();
  const pool = categoryImages[catKey] || categoryImages.general;
  return pool[index % pool.length];
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

    let rawGnewsUrl = "";
    if (searchTerm.trim().length > 0) {
      rawGnewsUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(searchTerm.trim())}&lang=${language}&max=12&apikey=${GNEWS_API_KEY}`;
    } else {
      rawGnewsUrl = `https://gnews.io/api/v4/top-headlines?category=${categoryForApi}&lang=${language}&max=12&apikey=${GNEWS_API_KEY}`;
    }

    // 🚀 CORS Proxy wrapper to prevent Vercel domain blocks
    const proxyGnewsUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(rawGnewsUrl)}`;

    const timer = setTimeout(() => {
      fetch(proxyGnewsUrl)
        .then((res) => {
          if (!res.ok) throw new Error("GNews error");
          return res.json();
        })
        .then((data) => {
          if (data && data.articles && data.articles.length > 0) {
            return data.articles.map((item, index) => ({
              id: `api-${index + 1}`,
              title: item.title,
              description: item.description || 'Latest news update.',
              category: currentCategory,
              author: item.source?.name || 'GNews Desk',
              image: getUniqueImage(item, currentCategory, index),
              url: item.url
            }));
          } else {
            throw new Error("No articles from GNews");
          }
        })
        .catch(() => {
          // 🚀 Category-Specific Fallback Feed
          let rssTopic = "";
          if (categoryForApi === 'technology') rssTopic = "headlines/section/topic/TECHNOLOGY";
          else if (categoryForApi === 'business') rssTopic = "headlines/section/topic/BUSINESS";
          else if (categoryForApi === 'sports') rssTopic = "headlines/section/topic/SPORTS";
          else if (categoryForApi === 'science') rssTopic = "headlines/section/topic/SCIENCE";
          else if (categoryForApi === 'health') rssTopic = "headlines/section/topic/HEALTH";
          else if (categoryForApi === 'world') rssTopic = "headlines/section/topic/WORLD";

          const rssUrl = rssTopic 
            ? `https://news.google.com/rss/${rssTopic}?hl=en-IN&gl=IN&ceid=IN:en`
            : `https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en`;

          const rss2jsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

          return fetch(rss2jsonUrl)
            .then(res => res.json())
            .then(rssData => {
              if (rssData && rssData.items && rssData.items.length > 0) {
                return rssData.items.slice(0, 12).map((item, index) => ({
                  id: `rss-${index + 1}`,
                  title: item.title,
                  description: item.description ? item.description.replace(/<[^>]*>?/gm, '').substring(0, 120) + '...' : 'Live news update',
                  category: currentCategory,
                  author: item.author || 'Google News',
                  image: getUniqueImage(item, currentCategory, index),
                  url: item.link
                }));
              }
              return [];
            });
        })
        .then((finalArticles) => {
          const localApproved = JSON.parse(localStorage.getItem('approvedNews') || '[]');
          const matchedApproved = localApproved.filter(item => 
            currentCategory === 'general' || item.category?.toLowerCase() === currentCategory.toLowerCase()
          );

          setNewsList([...matchedApproved, ...(finalArticles || [])]);
          setLoading(false);
        })
        .catch((err) => {
          console.error("News fetch error:", err);
          setLoading(false);
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