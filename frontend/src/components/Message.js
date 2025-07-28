import React from 'react';
import { Box, Text, Image, Tooltip } from '@chakra-ui/react';
import { isEmoji } from '../utils/emojiUtils'; // You'll need to create this helper

const Message = ({ message, currentUser }) => {
  // Determine if content is primarily emojis
  const containsOnlyEmojis = isEmoji(message.content);
  const isGif = message.messageType === 'gif' || message.isGif;
  const isImage = message.messageType === 'image';

  return (
    <Box
      maxWidth="80%"
      alignSelf={message.sender._id === currentUser._id ? 'flex-end' : 'flex-start'}
      mb={3}
      px={4}
      py={2}
      borderRadius="lg"
      bg={message.sender._id === currentUser._id ? 'blue.500' : 'gray.200'}
      color={message.sender._id === currentUser._id ? 'white' : 'black'}
    >
      {/* Sender name for group chats */}
      {message.chat.isGroupChat && message.sender._id !== currentUser._id && (
        <Text fontWeight="bold" mb={1}>
          {message.sender.name}
        </Text>
      )}

      {/* Message content */}
      {isGif ? (
        <Image 
          src={message.content} 
          alt="GIF" 
          borderRadius="md"
          maxH="200px"
          objectFit="contain"
        />
      ) : isImage ? (
        <Image 
          src={message.content} 
          alt="Uploaded" 
          borderRadius="md"
          maxH="300px"
          objectFit="contain"
        />
      ) : containsOnlyEmojis ? (
        <Text fontSize="3xl" lineHeight="1.2" textAlign="center">
          {message.content}
        </Text>
      ) : (
        <Text className="message-text" whiteSpace="pre-wrap">
          {message.content}
        </Text>
      )}

      {/* Timestamp with tooltip */}
      <Tooltip 
        label={new Date(message.createdAt).toLocaleString()} 
        placement="left"
        hasArrow
      >
        <Text 
          fontSize="xs" 
          textAlign="right" 
          mt={1}
          color={message.sender._id === currentUser._id ? 'whiteAlpha.700' : 'blackAlpha.600'}
        >
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </Tooltip>
    </Box>
  );
};

export default Message;