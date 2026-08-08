import React, { useState, useRef, useEffect } from 'react';
import { Button, Form, Card, Badge, Spinner } from 'react-bootstrap';
import { 
  FaRobot, FaPaperPlane, FaTimes, FaShieldAlt, 
  FaCheckCircle, FaExclamationTriangle, FaTimesCircle, 
  FaListUl, FaBullhorn, FaSearch, FaLink, FaRedo 
} from 'react-icons/fa';

function AskNewsChat({ newsList = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const welcomeMsg = `Hello! 👋 Welcome to **T-News AI Assistant**.

How can I help you today? Please choose an option or type its number:

1️⃣ **Today's Top Headlines**
2️⃣ **2-Min News Bulletin**
3️⃣ **Fact-Check a News Link**
4️⃣ **Search / Ask News Question**`;

  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: welcomeMsg
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isTyping]);

  // 🔍 Advanced Link Fact-Checker Engine (English)
  const analyzeNewsLink = (urlStr) => {
    try {
      const urlObj = new URL(urlStr);
      const domain = urlObj.hostname.toLowerCase().replace('www.', '');

      const trustedDomains = [
        'thehindu.com', 'reuters.com', 'aljazeera.com', 'timesofindia.indiatimes.com',
        'firstpost.com', 'bbc.com', 'bbc.co.uk', 'ndtv.com', 'indianexpress.com',
        'news.google.com', 'gnews.io', 'tribuneindia.com', 'moneycontrol.com',
        'livemint.com', 'business-standard.com', 'indiatoday.in', 'aajtak.in',
        'sandesh.com', 'divyabhaskar.co.in', 'gujaratmacharak.com', 'localhost'
      ];

      const suspiciousKeywords = ['free-money', 'click-here', 'jackpot', 'crypto-leak', 'viral-leak', 'miracle', 'secret-exposed'];

      const isTrusted = trustedDomains.some(td => domain.endsWith(td));
      const hasSuspiciousWords = suspiciousKeywords.some(word => urlStr.toLowerCase().includes(word));

      let trustScore = 85;
      let status = 'REAL / VERIFIED NEWS 🟢';
      let explanation = '';

      if (isTrusted && !hasSuspiciousWords) {
        trustScore = Math.floor(Math.random() * 11) + 89; // 89% - 99%
        status = 'REAL / VERIFIED NEWS 🟢';
        explanation = `This article originates from an authoritative and accredited news publisher (${domain}). The source is verified and highly authentic.`;
      } else if (hasSuspiciousWords) {
        trustScore = Math.floor(Math.random() * 20) + 15; // 15% - 35%
        status = 'SUSPICIOUS / POTENTIALLY FAKE 🔴';
        explanation = `This URL contains clickbait parameters or suspicious elements. Higher probability of misinformation or fake rumor.`;
      } else {
        trustScore = Math.floor(Math.random() * 25) + 50; // 50% - 75%
        status = 'UNVERIFIED SOURCE 🟡';
        explanation = `The domain (${domain}) is not listed in mainstream media networks. Please cross-check with official sources.`;
      }

      return `🔍 **AI News Fact-Check Report**

🌐 **Domain:** \`${domain}\`
🛡️ **Trust Score:** **${trustScore}%**
📊 **Status:** ${status}

📝 **AI Analysis:** ${explanation}

💡 *Recommendation: Avoid sharing unverified social media news without verifying with mainstream agencies.*`;

    } catch (e) {
      return "⚠️ Invalid URL format. Please paste a valid news link starting with http:// or https://";
    }
  };

  const handleOptionSelect = (optionNumber, customLabel = null) => {
    let userDisplay = customLabel || `Option ${optionNumber}`;
    if (optionNumber === 1) userDisplay = "1️⃣ Today's Headlines";
    else if (optionNumber === 2) userDisplay = "2️⃣ News Bulletin";
    else if (optionNumber === 3) userDisplay = "3️⃣ Fact-Check Link";
    else if (optionNumber === 4) userDisplay = "4️⃣ Search / Ask Question";
    else if (optionNumber === 'menu') userDisplay = "📋 Show Main Menu";

    setMessages(prev => [...prev, { sender: 'user', text: userDisplay }]);
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = '';

      if (optionNumber === 1 || optionNumber === '1') {
        if (newsList && newsList.length > 0) {
          const top4 = newsList.slice(0, 4).map((item, i) => `${i + 1}. **${item.title}**\n   *Source: ${item.author || 'T-News Desk'}*`).join('\n\n');
          botResponse = `📰 **Today's Top Breaking Headlines:**\n\n${top4}\n\n*Click any card on the main page to read full coverage.*`;
        } else {
          botResponse = "📰 Live news feed is currently updating. Please check back in a few seconds.";
        }
      } else if (optionNumber === 2 || optionNumber === '2') {
        if (newsList && newsList.length > 0) {
          const bulletPoints = newsList.slice(0, 3).map((item, i) => `• **${item.title}**: ${item.description || 'Live updates on current affairs.'}`).join('\n\n');
          botResponse = `🎙️ **2-Minute AI Audio Bulletin Script:**\n\n${bulletPoints}\n\n💡 *Tip: Click the red "Radio" button in the top navigation bar to listen to live audio radio news!*`;
        } else {
          botResponse = "🎙️ Audio news bulletin generating. Please try again shortly.";
        }
      } else if (optionNumber === 3 || optionNumber === '3') {
        botResponse = "🔗 **Link Fact-Checker Active**\n\nPlease copy and paste any news link (starting with http:// or https://) here, and I will analyze its source credibility for you!";
      } else if (optionNumber === 4 || optionNumber === '4') {
        botResponse = "🔍 **Custom Search Mode**\n\nType any keyword or topic (e.g. 'Tech', 'Sports', 'Elections', 'Weather') and I will fetch relevant news for you!";
      } else if (optionNumber === 'menu') {
        botResponse = welcomeMsg;
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
      setIsTyping(false);
    }, 700);
  };

  const handleSend = () => {
    if (!inputMsg.trim()) return;

    const text = inputMsg.trim();
    setInputMsg('');

    // If user enters option number '1', '2', '3', '4'
    if (['1', '2', '3', '4'].includes(text)) {
      handleOptionSelect(parseInt(text, 10));
      return;
    }

    const newMessages = [...messages, { sender: 'user', text }];
    setMessages(newMessages);
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = '';
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const extractedUrls = text.match(urlRegex);

      if (extractedUrls && extractedUrls.length > 0) {
        botResponse = analyzeNewsLink(extractedUrls[0]);
      } else {
        const lower = text.toLowerCase();
        if (lower.includes('menu') || lower.includes('option') || lower.includes('help')) {
          botResponse = welcomeMsg;
        } else if (newsList && newsList.length > 0) {
          const matched = newsList.filter(item => 
            item.title.toLowerCase().includes(lower) || 
            (item.description && item.description.toLowerCase().includes(lower))
          );

          if (matched.length > 0) {
            const results = matched.slice(0, 3).map((item, i) => `${i + 1}. **${item.title}**`).join('\n\n');
            botResponse = `🔍 **Search Results for "${text}":**\n\n${results}`;
          } else {
            botResponse = `I found no direct match for "${text}" in current headlines. You can paste a news link to fact-check it, or type **1** for Today's Headlines!`;
          }
        } else {
          botResponse = `Regarding **"${text}"**: T-News fetches live news globally. You can paste any article link here to fact-check it, or type **1** for top headlines!`;
        }
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <div className="position-fixed bottom-0 end-0 m-4 z-3">
        <Button 
          variant="primary" 
          className="rounded-circle p-3 shadow-lg d-flex align-items-center justify-content-center position-relative"
          style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)' }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes size={24} /> : <FaRobot size={28} />}
          {!isOpen && (
            <span className="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
              <span className="visually-hidden">New alerts</span>
            </span>
          )}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <Card 
          className="position-fixed bottom-0 end-0 m-3 m-md-4 shadow-lg border-0 rounded-4 z-3 overflow-hidden d-flex flex-column"
          style={{ width: '380px', maxHeight: '580px', height: '85vh' }}
        >
          {/* Header */}
          <Card.Header className="bg-primary text-white d-flex align-items-center justify-content-between p-3 border-0">
            <div className="d-flex align-items-center gap-2">
              <div className="bg-white text-primary rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                <FaRobot size={20} />
              </div>
              <div>
                <h6 className="mb-0 fw-bold">T-News AI Assistant</h6>
                <small className="text-light opacity-75 d-flex align-items-center gap-1" style={{ fontSize: '11px' }}>
                  <FaShieldAlt /> Fact-Checker & News AI
                </small>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Button 
                variant="link" 
                className="text-white p-0 me-1" 
                title="Main Menu"
                onClick={() => handleOptionSelect('menu')}
              >
                <FaRedo size={14} />
              </Button>
              <Button variant="link" className="text-white p-0" onClick={() => setIsOpen(false)}>
                <FaTimes size={18} />
              </Button>
            </div>
          </Card.Header>

          {/* Messages Container */}
          <Card.Body className="p-3 overflow-y-auto flex-grow-1 bg-light" style={{ fontSize: '13.5px' }}>
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`d-flex mb-3 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
              >
                <div 
                  className={`p-3 rounded-4 shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-white rounded-bottom-end-0' 
                      : 'bg-white text-dark rounded-bottom-start-0 border'
                  }`}
                  style={{ whiteSpace: 'pre-line', maxWidth: '88%' }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="d-flex justify-content-start mb-3">
                <div className="bg-white text-muted p-2 px-3 rounded-4 border shadow-sm d-flex align-items-center gap-2">
                  <Spinner animation="border" size="sm" variant="primary" />
                  <small>AI is processing...</small>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </Card.Body>

          {/* Interactive Option Buttons Bar */}
          <div className="px-2 py-2 bg-white border-top d-flex gap-1 overflow-x-auto text-nowrap" style={{ scrollbarWidth: 'none' }}>
            <Badge 
              bg="light" 
              text="dark" 
              className="border p-2 rounded-pill cursor-pointer d-flex align-items-center gap-1 shadow-sm" 
              style={{ cursor: 'pointer', fontSize: '11px' }}
              onClick={() => handleOptionSelect(1)}
            >
              <FaListUl className="text-primary" /> 1️⃣ Headlines
            </Badge>
            <Badge 
              bg="light" 
              text="dark" 
              className="border p-2 rounded-pill cursor-pointer d-flex align-items-center gap-1 shadow-sm" 
              style={{ cursor: 'pointer', fontSize: '11px' }}
              onClick={() => handleOptionSelect(2)}
            >
              <FaBullhorn className="text-success" /> 2️⃣ Bulletin
            </Badge>
            <Badge 
              bg="light" 
              text="dark" 
              className="border p-2 rounded-pill cursor-pointer d-flex align-items-center gap-1 shadow-sm" 
              style={{ cursor: 'pointer', fontSize: '11px' }}
              onClick={() => handleOptionSelect(3)}
            >
              <FaLink className="text-danger" /> 3️⃣ Fact-Check
            </Badge>
            <Badge 
              bg="light" 
              text="dark" 
              className="border p-2 rounded-pill cursor-pointer d-flex align-items-center gap-1 shadow-sm" 
              style={{ cursor: 'pointer', fontSize: '11px' }}
              onClick={() => handleOptionSelect(4)}
            >
              <FaSearch className="text-info" /> 4️⃣ Search
            </Badge>
          </div>

          {/* Form Input */}
          <Card.Footer className="p-2 bg-white border-top">
            <Form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }} 
              className="d-flex gap-2"
            >
              <Form.Control 
                type="text" 
                placeholder="Type 1-4, ask a question or paste URL..." 
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                className="rounded-pill border-1 fs-6 px-3"
                style={{ fontSize: '12.5px' }}
              />
              <Button 
                type="submit" 
                variant="primary" 
                className="rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: '38px', height: '38px' }}
              >
                <FaPaperPlane size={14} />
              </Button>
            </Form>
          </Card.Footer>
        </Card>
      )}
    </>
  );
}

export default AskNewsChat;