import Message from '../models/Message.js';
import User from '../models/User.js';
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini SDK
let ai = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    console.log('Gemini AI SDK initialized successfully.');
  } catch (err) {
    console.error('Error initializing Gemini AI SDK:', err);
  }
} else {
  console.warn('GEMINI_API_KEY is not defined in the environment. Gemini Bot replies will be simulated with a config warning.');
}

// In-memory store for tracking online users in rooms
// Structure: RoomId -> Map(UserId -> { username, avatarColor, socketId })
const roomUsers = new Map();

let geminiBotUser = null;
const getGeminiBotUser = async () => {
  if (geminiBotUser) return geminiBotUser;
  
  // Find or create Gemini Bot in DB
  geminiBotUser = await User.findOne({ email: 'gemini@ai.assistant' });
  if (!geminiBotUser) {
    geminiBotUser = await User.create({
      username: 'Gemini AI Assistant',
      email: 'gemini@ai.assistant',
      password: 'geminibot_secure_password_9900', // fallback, not used for login
      bio: 'Official Google Gemini AI Assistant. Type @gemini inside the live chat to ask me anything!',
      avatarColor: '#8b5cf6', // purple theme
    });
  }
  return geminiBotUser;
};

const chatSocket = (io) => {
  // Helper function to query Gemini and broadcast responses
  const handleGeminiReply = async (discussionId, userContent) => {
    try {
      // 1. Get/Create the Gemini Bot User
      const botUser = await getGeminiBotUser();

      // 2. Broadcast that Gemini Bot is typing
      io.to(discussionId).emit('user_typing', { username: botUser.username, isTyping: true });

      let replyText = '';
      const userQuestion = userContent.replace(/@gemini/i, '').trim();

      if (!userQuestion) {
        replyText = "Hello! I am your Gemini AI Assistant. Ask me anything technical by typing `@gemini your question` inside this chat channel!";
      } else if (!ai) {
        replyText = "⚠️ **Configuration Notice**: I am ready to answer, but the `GEMINI_API_KEY` is not set in the server's `.env` file. Please obtain an API key from Google AI Studio and configure it as `GEMINI_API_KEY` inside `server/.env` to enable real-time replies!";
      } else {
        // 3. Query Gemini
        try {
          const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are an expert technical advisor in the CommSphere developer forum. Answer the user's question concisely, using Markdown code blocks if relevant. Question: ${userQuestion}`,
          });
          replyText = result.text || "I received your query but could not formulate a response.";
        } catch (geminiError) {
          console.error('Error from Gemini API:', geminiError);
          replyText = `⚠️ **Gemini API Error**: ${geminiError.message || 'Something went wrong during generation.'}`;
        }
      }

      // 4. Save Bot message to database
      const botMessage = await Message.create({
        discussion: discussionId,
        sender: botUser._id,
        content: replyText,
      });

      const populatedBotMessage = await Message.findById(botMessage._id)
        .populate('sender', 'username avatarColor');

      // 5. Turn off typing status and broadcast response
      io.to(discussionId).emit('user_typing', { username: botUser.username, isTyping: false });
      io.to(discussionId).emit('receive_message', populatedBotMessage);

    } catch (err) {
      console.error('Failed to handle Gemini reply:', err);
      try {
        const botUser = await getGeminiBotUser();
        io.to(discussionId).emit('user_typing', { username: botUser.username, isTyping: false });
      } catch (_) {}
    }
  };

  io.on('connection', (socket) => {
    console.log(`Socket Connected: ${socket.id}`);

    // Join Discussion Room
    socket.on('join_room', async ({ discussionId, userId, username, avatarColor }) => {
      socket.join(discussionId);
      console.log(`User ${username} (${userId}) joined room: ${discussionId}`);

      // Add user to the room registry
      if (!roomUsers.has(discussionId)) {
        roomUsers.set(discussionId, new Map());
      }
      
      const usersInRoom = roomUsers.get(discussionId);
      usersInRoom.set(userId, { username, avatarColor, socketId: socket.id });

      // Send the list of online users in this room to all clients in the room
      io.to(discussionId).emit('room_users', Array.from(usersInRoom.values()));

      // Fetch message history and send it to the joining client
      try {
        const history = await Message.find({ discussion: discussionId })
          .populate('sender', 'username avatarColor')
          .sort({ createdAt: 1 })
          .limit(50);
        
        socket.emit('message_history', history);
      } catch (err) {
        console.error('Error fetching chat history:', err);
      }
    });

    // Send Message
    socket.on('send_message', async ({ discussionId, senderId, content }) => {
      try {
        if (!content || content.trim() === '') return;

        // Save message to database
        const newMessage = await Message.create({
          discussion: discussionId,
          sender: senderId,
          content: content.trim(),
        });

        // Populate sender info
        const populatedMessage = await Message.findById(newMessage._id)
          .populate('sender', 'username avatarColor');

        // Broadcast message to everyone in the room
        io.to(discussionId).emit('receive_message', populatedMessage);

        // Check if message is addressed to Gemini Bot
        if (content.trim().toLowerCase().includes('@gemini')) {
          handleGeminiReply(discussionId, content);
        }
      } catch (err) {
        console.error('Error saving/sending socket message:', err);
      }
    });

    // Typing Indicators
    socket.on('typing', ({ discussionId, username, isTyping }) => {
      socket.to(discussionId).emit('user_typing', { username, isTyping });
    });

    // Leave Room
    socket.on('leave_room', ({ discussionId, userId }) => {
      socket.leave(discussionId);
      console.log(`User ${userId} left room: ${discussionId}`);

      if (roomUsers.has(discussionId)) {
        const usersInRoom = roomUsers.get(discussionId);
        usersInRoom.delete(userId);
        
        if (usersInRoom.size === 0) {
          roomUsers.delete(discussionId);
        } else {
          io.to(discussionId).emit('room_users', Array.from(usersInRoom.values()));
        }
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`Socket Disconnected: ${socket.id}`);
      
      // Clean up user from all rooms they were registered in
      for (const [discussionId, usersInRoom] of roomUsers.entries()) {
        let userFound = false;
        
        for (const [userId, userInfo] of usersInRoom.entries()) {
          if (userInfo.socketId === socket.id) {
            usersInRoom.delete(userId);
            userFound = true;
            console.log(`Removed user ${userInfo.username} from room ${discussionId} on disconnect`);
            break;
          }
        }

        if (userFound) {
          if (usersInRoom.size === 0) {
            roomUsers.delete(discussionId);
          } else {
            io.to(discussionId).emit('room_users', Array.from(usersInRoom.values()));
          }
        }
      }
    });
  });
};

export default chatSocket;
