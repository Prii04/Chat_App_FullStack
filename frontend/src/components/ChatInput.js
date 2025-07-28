// components/ChatInput.js
import React, { useState } from 'react';
import ChatInputTools from './ChatInputTools';

const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji);
  };

  const handleGifSelect = (gifUrl) => {
    onSendMessage(`[GIF]${gifUrl}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="chat-input-form">
      <ChatInputTools 
        onEmojiSelect={handleEmojiSelect}
        onGifSelect={handleGifSelect}
      />
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter a message"
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default ChatInput;