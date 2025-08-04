import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPaperPlane, 
  faRobot, 
  faUser,
  faLightbulb
} from '@fortawesome/free-solid-svg-icons';
import { apiService, ChatMessage } from '../services/api';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await apiService.sendChatMessage(inputMessage);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      // For demo purposes, create a mock response
      const mockResponse: ChatMessage = {
        role: 'assistant',
        content: `I understand you're asking about "${inputMessage}". Based on our candidate database, I can help you find the best matches for your requirements. Could you please provide more specific details about what you're looking for?`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, mockResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "Who are the best frontend developers?",
    "Show me candidates with Python experience",
    "Find candidates for senior positions",
    "Who has the highest matching scores?",
    "What are the top candidates for data science roles?"
  ];

  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <div className="chatbot-page">
      <div className="chatbot-header">
        <h2>
          <FontAwesomeIcon icon={faRobot} /> AI Recruitment Assistant
        </h2>
        <p>Ask me anything about candidates, job matches, or recruitment analytics</p>
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="welcome-message">
              <div className="welcome-icon">
                <FontAwesomeIcon icon={faRobot} />
              </div>
              <h3>Welcome to the AI Recruitment Assistant!</h3>
              <p>I can help you with:</p>
              <ul>
                <li>Finding the best candidates for specific roles</li>
                <li>Analyzing candidate matching scores</li>
                <li>Providing insights about candidate qualifications</li>
                <li>Answering questions about recruitment analytics</li>
              </ul>
              
              <div className="suggested-questions">
                <h4>Try asking:</h4>
                <div className="question-chips">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      className="question-chip"
                      onClick={() => handleSuggestedQuestion(question)}
                    >
                      <FontAwesomeIcon icon={faLightbulb} />
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
            >
              <div className="message-avatar">
                <FontAwesomeIcon 
                  icon={message.role === 'user' ? faUser : faRobot} 
                />
              </div>
              <div className="message-content">
                <div className="message-text">{message.content}</div>
                <div className="message-time">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="message assistant-message">
              <div className="message-avatar">
                <FontAwesomeIcon icon={faRobot} />
              </div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-container">
          <div className="input-wrapper">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about candidates, job matches, or recruitment analytics..."
              className="chat-input"
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="send-button"
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;