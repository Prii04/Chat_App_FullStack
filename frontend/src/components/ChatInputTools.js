// components/ChatInputTools.js
import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { Grid } from '@giphy/react-components';

const gf = new GiphyFetch('YOUR_GIPHY_API_KEY'); // Get from https://developers.giphy.com/

const ChatInputTools = ({ onEmojiSelect, onGifSelect }) => {
  const [showEmojis, setShowEmojis] = useState(false);
  const [showGifs, setShowGifs] = useState(false);

  const fetchGifs = (offset) => gf.trending({ offset, limit: 10 });

  return (
    <div className="chat-tools">
      <button onClick={() => { setShowEmojis(!showEmojis); setShowGifs(false); }}>
        😊
      </button>
      <button onClick={() => { setShowGifs(!showGifs); setShowEmojis(false); }}>
        GIF
      </button>

      {showEmojis && (
        <div className="emoji-picker">
          <EmojiPicker onEmojiClick={(emoji) => { 
            onEmojiSelect(emoji.emoji);
            setShowEmojis(false);
          }} />
        </div>
      )}

      {showGifs && (
        <div className="gif-picker">
          <Grid
            width={300}
            columns={3}
            fetchGifs={fetchGifs}
            onGifClick={(gif) => {
              onGifSelect(gif.images.fixed_height.url);
              setShowGifs(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ChatInputTools;