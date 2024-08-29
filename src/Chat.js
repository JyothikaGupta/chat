// src/Chat.js
import React, { useState } from 'react';
import axios from 'axios';
import './Chat.css'; // Import the CSS file for styling

const Chat = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Ensure the prompt is in the correct format (string)
      const promptBody = JSON.stringify(prompt);

      // Make POST request to the backend API
      const result = await axios.post('http://localhost:8080/api/chat', promptBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Extract the reply from the response
      const reply = result.data;

      // Update the state with the response and conversation history
      setConversationHistory((prev) => [
        ...prev,
        { role: 'user', text: prompt },
        { role: 'ai', text: reply }
      ]);
      setPrompt('');
    } catch (error) {
      // More detailed error logging
      console.error('Error fetching data:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="chat-container">
      <h1>Chat with AI</h1>
      <div className="chat-box">
        {conversationHistory.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <strong>{message.role === 'user' ? 'You' : 'AI'}:</strong> {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="chat-form">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows="4"
          cols="50"
          placeholder="Type your message here..."
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
