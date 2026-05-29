import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, Sparkles, Volume2 } from 'lucide-react';
import { initiateSocket, getSocket } from '../sockets/socket';

const RealtimeChatSection = ({ discussionId, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [socket, setSocket] = useState(null);
  
  const chatEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!currentUser) return;

    // Initialize socket connection
    const token = localStorage.getItem('token');
    const socketInstance = initiateSocket(token);
    setSocket(socketInstance);

    // Join room
    socketInstance.emit('join_room', {
      discussionId,
      userId: currentUser._id,
      username: currentUser.username,
      avatarColor: currentUser.avatarColor,
    });

    // Event listeners
    socketInstance.on('message_history', (history) => {
      setMessages(history);
    });

    socketInstance.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketInstance.on('room_users', (users) => {
      setOnlineUsers(users);
    });

    socketInstance.on('user_typing', ({ username, isTyping }) => {
      setTypingUsers((prev) => {
        const next = new Set(prev);
        if (isTyping) {
          next.add(username);
        } else {
          next.delete(username);
        }
        return next;
      });
    });

    // Cleanup on unmount
    return () => {
      socketInstance.emit('leave_room', {
        discussionId,
        userId: currentUser._id,
      });
      socketInstance.off('message_history');
      socketInstance.off('receive_message');
      socketInstance.off('room_users');
      socketInstance.off('user_typing');
    };
  }, [discussionId, currentUser]);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);

    if (!socket || !currentUser) return;

    // Send typing status
    socket.emit('typing', {
      discussionId,
      username: currentUser.username,
      isTyping: true,
    });

    // Clear previous timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', {
        discussionId,
        username: currentUser.username,
        isTyping: false,
      });
    }, 2000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socket || !currentUser) return;

    // Stop typing
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socket.emit('typing', {
      discussionId,
      username: currentUser.username,
      isTyping: false,
    });

    // Send message event
    socket.emit('send_message', {
      discussionId,
      senderId: currentUser._id,
      content: inputMessage.trim(),
    });

    setInputMessage('');
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col md:flex-row h-[500px]">
      
      {/* Messages Pane */}
      <div className="flex-1 flex flex-col h-full bg-slate-950/40">
        
        {/* Chat Header */}
        <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-semibold text-slate-200">Live Discussion Channel</span>
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-indigo-400 font-medium bg-indigo-950/30 px-2 py-0.5 rounded-full border border-indigo-900/40">
            <Volume2 className="h-3 w-3" />
            <span>Real-time Chat Sync</span>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-2">
              <Sparkles className="h-8 w-8 text-slate-700" />
              <p className="text-slate-500 text-sm">No live chat history here yet.</p>
              <p className="text-slate-600 text-xs">Say hello to other members currently online!</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMe = currentUser && msg.sender?._id === currentUser._id;
              return (
                <div
                  key={msg._id || index}
                  className={`flex items-start gap-2.5 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  {/* Sender Avatar */}
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-xs uppercase shrink-0"
                    style={{ backgroundColor: msg.sender?.avatarColor || '#6366f1' }}
                  >
                    {msg.sender?.username?.charAt(0) || '?'}
                  </div>

                  {/* Bubble Container */}
                  <div className="space-y-1">
                    <div className={`flex items-center gap-2 ${isMe ? 'justify-end' : ''}`}>
                      <span className="text-xs font-semibold text-slate-350">
                        {isMe ? 'You' : msg.sender?.username || 'Deleted User'}
                      </span>
                      <span className="text-[10px] text-slate-550">{formatTime(msg.createdAt)}</span>
                    </div>
                    
                    <div
                      className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                        isMe
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/50'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Typing indicators */}
        {typingUsers.size > 0 && (
          <div className="px-4 py-1.5 bg-slate-900/30 text-xs text-slate-400 italic flex items-center space-x-1 border-t border-slate-850">
            <div className="flex space-x-1 mr-1.5 shrink-0 items-center">
              <span className="h-1 w-1 bg-indigo-400 rounded-full animate-bounce"></span>
              <span className="h-1 w-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="h-1 w-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
            <span>
              {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
            </span>
          </div>
        )}

        {/* Chat Input */}
        {currentUser ? (
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-900/80 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              placeholder="Send a live message..."
              className="flex-1 bg-slate-950 text-slate-100 placeholder-slate-500 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl transition-all disabled:opacity-40 disabled:hover:bg-indigo-600"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <div className="p-3 bg-slate-900/80 border-t border-slate-850 text-center text-xs text-slate-500">
            You must log in to chat in real-time.
          </div>
        )}
      </div>

      {/* Online Users List Pane */}
      <div className="w-full md:w-48 bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 p-4 flex flex-col h-1/3 md:h-full">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
          <Users className="h-3.5 w-3.5 text-indigo-400" />
          <span>Active ({onlineUsers.length})</span>
        </h4>
        
        <div className="flex-1 overflow-y-auto space-y-2">
          {onlineUsers.map((user, idx) => (
            <div key={idx} className="flex items-center space-x-2 p-1 hover:bg-slate-800/40 rounded-lg transition-colors">
              <div
                className="h-6.5 w-6.5 rounded-full flex items-center justify-center text-white font-bold text-[10px] uppercase shrink-0 border border-slate-700"
                style={{ backgroundColor: user.avatarColor || '#6366f1' }}
              >
                {user.username.charAt(0)}
              </div>
              <span className="text-xs font-medium text-slate-350 truncate" title={user.username}>
                {user.username}
              </span>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default RealtimeChatSection;
