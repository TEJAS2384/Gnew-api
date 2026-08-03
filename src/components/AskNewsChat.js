import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Form, InputGroup, Badge } from 'react-bootstrap';
import { FaRobot, FaPaperPlane, FaTimes, FaMagic, FaUser } from 'react-icons/fa';

// 🔑 Your Real Gemini API Key
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "";

// Helper component to format **bold** text and line breaks
const FormattedMessage = ({ text }) => {
  const lines = text.split('\n');
  return (
    <div>
      {lines.map((line, i) => {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <div key={i} style={{ minHeight: line === '' ? '6px' : 'auto' }}>
            {parts.map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={j}>{part.slice(2, -2)}</strong>;
              }
              return part;
            })}
          </div>
        );
      })}
    </div>
  );
};

function AskNewsChat({ newsList = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: '👋 Hey Tejas! I am powered by Real Gemini AI. Ask me anything about today\'s top 10 news, sports, tech, or stocks!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const suggestions = [
    "Give me main 10 today's news",
    "Who won the last FIFA World Cup?",
    "What is happening in stock markets?"
  ];

  // 🤖 Real Gemini AI API Call Function
  const handleSend = async (textToSend) => {
    const rawQuery = textToSend || input;
    if (!rawQuery.trim()) return;

    const userMsg = { sender: 'user', text: rawQuery };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      // Create live news context from loaded feed
      const newsContext = newsList.map((n, idx) => `${idx + 1}. [${n.category?.toUpperCase()}] ${n.title}: ${n.description}`).join('\n');

      const systemPrompt = `You are "Ask News AI", a friendly, witty, and highly intelligent AI news assistant on the G-News platform built by Tejas.

Here is the current live news feed on the website:
${newsContext}

Rules:
1. If user asks for top 10 news / main headlines, list all articles nicely with 1-10 numbers, emojis, and bold titles!
2. If user asks general knowledge, sports, FIFA, or world questions, use your AI knowledge base to answer accurately.
3. Format output cleanly with bullet points and bold headers.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nUser Question: ${rawQuery}` }]
            }
          ]
        })
      });

      const data = await response.json();
      let botAnswer = "";

      if (response.ok && data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        botAnswer = data.candidates[0].content.parts[0].text;
      } else {
        // 🚀 Smart Fallback Logic for 10 News & Other Topics
        const lower = rawQuery.toLowerCase();

        if (lower.includes("10") || lower.includes("top") || lower.includes("main") || lower.includes("all news") || lower.includes("headlines")) {
          const topList = newsList.slice(0, 10).map((n, idx) => 
            `**${idx + 1}. [${n.category?.toUpperCase()}] ${n.title}**\n${n.description?.substring(0, 80)}...`
          ).join('\n\n');

          botAnswer = `📰 **Today's Top News Headlines:**\n\n${topList}`;
        } 
        else if (lower.includes("fifa") || lower.includes("football") || lower.includes("world cup")) {
          botAnswer = "⚽ **FIFA World Cup Briefing:**\n\nArgentina won the 2022 FIFA World Cup in Qatar! The next FIFA World Cup 2026 will be hosted across USA, Canada, and Mexico.";
        } 
        else if (lower.includes("hii") || lower.includes("hi") || lower.includes("hello")) {
          botAnswer = "Hey Tejas! 👋 Super excited to chat with you! Ask me for **'top 10 news'**, sports, or technology updates!";
        } 
        else {
          const topList = newsList.slice(0, 5).map((n, idx) => 
            `• **${n.title}:** ${n.description?.substring(0, 70)}...`
          ).join('\n\n');

          botAnswer = `🤖 **Ask News AI Summary for "${rawQuery}":**\n\n${topList}`;
        }
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: botAnswer }]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      
      const topList = newsList.slice(0, 10).map((n, idx) => 
        `**${idx + 1}. ${n.title}**`
      ).join('\n');

      setMessages((prev) => [...prev, { 
        sender: 'bot', 
        text: `📰 **Today's Live Top Headlines:**\n\n${topList}` 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '25px', right: '25px', zIndex: 9999 }}>
      {/* 🤖 Floating AI Robot Button */}
      {!isOpen && (
        <Button 
          variant="primary" 
          onClick={() => setIsOpen(true)}
          className="rounded-circle p-3 shadow-lg d-flex align-items-center justify-content-center border-0"
          style={{ width: '62px', height: '62px', background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)' }}
        >
          <FaRobot size={28} className="text-white" />
        </Button>
      )}

      {/* 💬 Chat Widget Drawer */}
      {isOpen && (
        <Card className="shadow-lg border-0 rounded-4 overflow-hidden" style={{ width: '365px', height: '510px' }}>
          {/* Header */}
          <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center py-3" style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)' }}>
            <div className="d-flex align-items-center gap-2">
              <FaRobot size={24} />
              <div>
                <h6 className="mb-0 fw-bold">Ask News AI</h6>
                <small className="opacity-75" style={{ fontSize: '11px' }}>⚡ Powered by G-News</small>
              </div>
            </div>
            <Button variant="link" className="text-white p-0" onClick={() => setIsOpen(false)}>
              <FaTimes size={18} />
            </Button>
          </Card.Header>

          {/* Messages Body */}
          <Card.Body className="p-3 overflow-auto bg-light d-flex flex-column gap-3" style={{ height: '350px' }}>
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`d-flex align-items-start gap-2 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="bg-primary text-white rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm" style={{ width: '32px', height: '32px' }}>
                    <FaRobot size={16} />
                  </div>
                )}

                <div 
                  className={`p-2 px-3 rounded-3 shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-white rounded-bottom-end-0' 
                      : 'bg-white text-dark border rounded-bottom-start-0'
                  }`}
                  style={{ maxWidth: '82%', fontSize: '13px', lineHeight: '1.5' }}
                >
                  <FormattedMessage text={msg.text} />
                </div>

                {msg.sender === 'user' && (
                  <div className="bg-secondary text-white rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm" style={{ width: '32px', height: '32px' }}>
                    <FaUser size={14} />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="text-muted small d-flex align-items-center gap-2 ms-4">
                <FaMagic className="text-warning" /> Gemini AI is thinking...
              </div>
            )}
            <div ref={chatEndRef} />
          </Card.Body>

          {/* Quick Suggestion Chips */}
          <div className="px-2 py-1 bg-white border-top overflow-x-auto d-flex gap-1" style={{ scrollbarWidth: 'none' }}>
            {suggestions.map((chip, idx) => (
              <Badge 
                key={idx} 
                bg="light" 
                text="dark" 
                className="border text-truncate py-1 px-2"
                style={{ cursor: 'pointer', fontSize: '10px', whiteSpace: 'nowrap' }}
                onClick={() => handleSend(chip)}
              >
                💡 {chip}
              </Badge>
            ))}
          </div>

          {/* Input Box Footer */}
          <Card.Footer className="bg-white p-2 border-top">
            <Form onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
              <InputGroup>
                <Form.Control 
                  placeholder="Ask Gemini AI anything..." 
                  size="sm"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  style={{ fontSize: '12px' }}
                />
                <Button variant="primary" size="sm" type="submit">
                  <FaPaperPlane size={12} />
                </Button>
              </InputGroup>
            </Form>
          </Card.Footer>
        </Card>
      )}
    </div>
  );
}

export default AskNewsChat;