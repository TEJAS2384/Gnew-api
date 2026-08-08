import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Analytics } from "@vercel/analytics/react"

import AppNavbar from './components/Navbar';
import Ticker from './components/Ticker'; 
import BreakingNewsBanner from './components/BreakingNewsBanner'; // 🟢 Import Banner
import NewsCard from './components/NewsCard';
import SubmitNews from './components/SubmitNews';
import AdminPanel from './components/AdminPanel';
import AskNewsChat from './components/AskNewsChat';

const GNEWS_API_KEY = "700109c3b2c10f2cd490f40d7c002bab";

// 🌐 Dynamic UI Translations
const UI_TEXT = {
  en: {
    breaking: "🔥 Breaking News",
    readFull: "Read Full Article",
    latest: "Latest",
    news: "News",
    searchResults: 'Search Results for',
    fetching: "Fetching Live News...",
    noNews: "🔍 No news articles found right now.",
    savedArticles: "🔖 Saved Articles",
    noSaved: "No bookmarked articles yet."
  },
  hi: {
    breaking: "🔥 ब्रेकिंग न्यूज़",
    readFull: "पूरा लेख पढ़ें",
    latest: "ताज़ा",
    news: "समाचार",
    searchResults: "के लिए खोज परिणाम",
    fetching: "लाइव समाचार लोड हो रहे हैं...",
    noNews: "🔍 अभी कोई समाचार नहीं मिले।",
    savedArticles: "🔖 सहेजे गए लेख",
    noSaved: "अभी तक कोई बुकमार्क नहीं है।"
  },
  gu: {
    breaking: "🔥 બ્રેકિંગ ન્યૂઝ",
    readFull: "સંપૂર્ણ સમાચાર વાંચો",
    latest: "તાજા",
    news: "સમાચાર",
    searchResults: "માટે શોધ પરિણામો",
    fetching: "લાઈવ સમાચાર આવી રહ્યા છે...",
    noNews: "🔍 હાલમાં કોઈ સમાચાર મળ્યા નથી.",
    savedArticles: "સાચવેલા સમાચાર",
    noSaved: "હજુ સુધી કોઈ બુકમાર્ક સાચવેલ નથી."
  }
};

// 🖼️ Guaranteed 100% Unique Dynamic Image Engine
const getUniqueImage = (item, category, index) => {
  // 1. Check if original API image exists and is valid
  if (item.image && typeof item.image === 'string' && item.image.startsWith('http') && !item.image.includes('placeholder')) return item.image;
  if (item.urlToImage && typeof item.urlToImage === 'string' && item.urlToImage.startsWith('http') && !item.urlToImage.includes('placeholder')) return item.urlToImage;
  if (item.thumbnail && typeof item.thumbnail === 'string' && item.thumbnail.startsWith('http')) return item.thumbnail;
  if (item.enclosure?.link && typeof item.enclosure.link === 'string' && item.enclosure.link.startsWith('http')) return item.enclosure.link;

  // 2. Extract embedded image from HTML description if available
  if (item.description && typeof item.description === 'string') {
    const imgMatch = item.description.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch && imgMatch[1] && imgMatch[1].startsWith('http')) {
      return imgMatch[1];
    }
  }

  // 3. Dynamic Seed Fallback: Generates a 100% distinct photo per title
  const titleSeed = (item.title || `news-${index}`).replace(/[^a-zA-Z0-9]/g, '').substring(0, 25);
  const seedKey = `${category || 'world'}-${titleSeed}-${index}`;
  return `https://picsum.photos/seed/${encodeURIComponent(seedKey)}/600/350`;
};

function NewsFeed({ newsList, setNewsList, language }) {
  const { categoryName } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [userCity, setUserCity] = useState(localStorage.getItem('userCity') || 'Ahmedabad');

  const currentCategory = categoryName || 'world';
  const txt = UI_TEXT[language] || UI_TEXT.en;

  useEffect(() => {
    const handleCityChange = () => {
      setUserCity(localStorage.getItem('userCity') || 'Ahmedabad');
    };
    window.addEventListener('cityChanged', handleCityChange);
    return () => window.removeEventListener('cityChanged', handleCityChange);
  }, []);

  useEffect(() => {
    setLoading(true);

    let categoryForApi = currentCategory.toLowerCase();
    if (categoryForApi === 'tech') categoryForApi = 'technology';

    let queryParam = searchTerm.trim();
    if (!queryParam && categoryForApi === 'local') {
      queryParam = userCity;
    }

    let rawGnewsUrl = "";
    if (queryParam.length > 0) {
      rawGnewsUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(queryParam)}&lang=${language}&max=12&apikey=${GNEWS_API_KEY}`;
    } else {
      rawGnewsUrl = `https://gnews.io/api/v4/top-headlines?category=${categoryForApi}&lang=${language}&max=12&apikey=${GNEWS_API_KEY}`;
    }

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
              author: item.source?.name || 'TNews Desk',
              image: getUniqueImage(item, currentCategory, index),
              url: item.url
            }));
          } else {
            throw new Error("No articles from GNews");
          }
        })
        .catch(() => {
          // 🚀 Dynamic RSS Fallback
          let rssTopic = "";
          if (categoryForApi === 'technology') rssTopic = "headlines/section/topic/TECHNOLOGY";
          else if (categoryForApi === 'business') rssTopic = "headlines/section/topic/BUSINESS";
          else if (categoryForApi === 'sports') rssTopic = "headlines/section/topic/SPORTS";
          else if (categoryForApi === 'science') rssTopic = "headlines/section/topic/SCIENCE";
          else if (categoryForApi === 'health') rssTopic = "headlines/section/topic/HEALTH";
          else if (categoryForApi === 'world') rssTopic = "headlines/section/topic/WORLD";

          let rssLang = "en-IN";
          let ceid = "IN:en";
          if (language === 'hi') {
            rssLang = "hi";
            ceid = "IN:hi";
          } else if (language === 'gu') {
            rssLang = "gu";
            ceid = "IN:gu";
          }

          let rssUrl = "";
          if (categoryForApi === 'local') {
            rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(userCity)}&hl=${rssLang}&gl=IN&ceid=${ceid}`;
          } else if (rssTopic) {
            rssUrl = `https://news.google.com/rss/${rssTopic}?hl=${rssLang}&gl=IN&ceid=${ceid}`;
          } else {
            rssUrl = `https://news.google.com/rss?hl=${rssLang}&gl=IN&ceid=${ceid}`;
          }

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
            currentCategory === 'world' || item.category?.toLowerCase() === currentCategory.toLowerCase()
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
  }, [currentCategory, language, searchTerm, userCity, setNewsList]);

  const heroArticle = newsList.length > 0 ? newsList[0] : null;
  const gridArticles = newsList.length > 1 ? newsList.slice(1) : [];

  const getHeadingTitle = () => {
    if (searchTerm.trim()) return `${txt.searchResults} "${searchTerm}"`;
    if (currentCategory === 'local') return `${txt.latest} ${userCity} ${txt.news}`;
    return `${txt.latest} ${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)} ${txt.news}`;
  };

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
          <p className="mt-2 text-muted fw-bold">{txt.fetching}</p>
        </div>
      ) : newsList.length === 0 ? (
        <div className="text-center py-5 text-muted card shadow-sm border-0 p-5 my-4">
          <h5>{txt.noNews}</h5>
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
                  <span className="badge bg-danger mb-2 px-3 py-2 uppercase fw-bold">{txt.breaking}</span>
                  <h3 className="fw-bold mb-3">{heroArticle.title}</h3>
                  <p className="text-secondary mb-4">{heroArticle.description}</p>
                  <a href={heroArticle.url || "#"} target="_blank" rel="noreferrer" className="btn btn-primary fw-bold px-4 py-2 rounded-pill">
                    {txt.readFull}
                  </a>
                </div>
              </div>
            </div>
          )}

          <h3 className="fw-bold mb-4 border-start border-4 border-primary ps-3">
            {getHeadingTitle()}
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
  const txt = UI_TEXT[language] || UI_TEXT.en;

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
      <h3 className="fw-bold mb-4">{txt.savedArticles} ({savedItems.length})</h3>
      {savedItems.length === 0 ? (
        <div className="text-center py-5 text-muted card shadow-sm border-0 p-5">
          <h5>{txt.noSaved}</h5>
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

        {/* 🚀 Sleek Live Ticker Bar */}
        <Ticker />

        {/* 🚨 Mobile & Desktop Breaking News Strip with Phone Notification Support */}
        <BreakingNewsBanner newsList={news} />

        <Routes>
          <Route path="/" element={<NewsFeed newsList={news} setNewsList={setNews} language={language} />} />
          <Route path="/category/:categoryName" element={<NewsFeed newsList={news} setNewsList={setNews} language={language} />} />
          <Route path="/saved" element={<SavedNews language={language} />} />
          <Route path="/submit-news" element={<SubmitNews />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
        
        <AskNewsChat newsList={news} />

        <footer className="text-center py-4 border-top mt-5 text-muted small">
          <p className="mb-0">© 2026 T-News Platform. All rights reserved.</p>
          <p className="fw-bold text-primary mb-0">Developed by Tejas😎</p>
        </footer>
      </Router>
    </div>
  );
}

export default App;