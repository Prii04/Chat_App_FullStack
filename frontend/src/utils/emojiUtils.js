// utils/emojiUtils.js
export const isEmoji = (str) => {
    // Simple emoji detection
    const emojiRegex = /^(\p{Emoji}|\s)+$/u;
    return emojiRegex.test(str);
  };