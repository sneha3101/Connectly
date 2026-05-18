import React, { useCallback, useState, useEffect, useRef } from 'react';
import { chatAPI, connectionAPI, MEDIA_URL } from '../utils/api';
import { getSocket } from '../utils/socket';
import { getUser } from '../utils/auth';
const demoMessages = [
  { name: 'Luna', status: 'Online', mood: 'online', avatar: 'L', text: 'Hey everyone! 👋', time: 'Today at 10:30 AM', tone: 'pink' },
  { name: 'Mason', status: 'Online', mood: 'online', avatar: 'M', text: "Hi Luna! How's it going?", time: 'Today at 10:31 AM', tone: 'blue' },
  { name: 'Ava', status: 'Idle', mood: 'idle', avatar: 'A', text: 'Doing great! Working on a new project 🚀', time: 'Today at 10:32 AM', tone: 'gold' },
  { name: 'Noah', status: 'Offline', mood: 'offline', avatar: 'N', text: "That's awesome! Can't wait to see it.", time: 'Today at 10:33 AM', tone: 'purple' },
  { name: 'Luna', status: 'Online', mood: 'online', avatar: 'L', text: "Here's a sneak peek 👀", time: 'Today at 10:34 AM', tone: 'pink', image: true },
];

const DEMO_CHAT_CLEARED_KEY = 'connectly_demo_chat_cleared';
const CLEARED_CHATS_KEY = 'connectly_cleared_chats';
const directUsers = demoMessages.slice(0, 4);

const getClearedChats = () => {
  try {
    return JSON.parse(localStorage.getItem(CLEARED_CHATS_KEY) || '{}');
  } catch (err) {
    return {};
  }
};

const getClearedAt = (chatId) => getClearedChats()[chatId] || 0;

const markChatCleared = (chatId, clearedAt) => {
  const clearedChats = getClearedChats();
  clearedChats[chatId] = clearedAt;
  localStorage.setItem(CLEARED_CHATS_KEY, JSON.stringify(clearedChats));
};

const isAfterClearTime = (message, clearedAt) => {
  if (!clearedAt) return true;
  const messageTime = message.createdAt ? new Date(message.createdAt).getTime() : Date.now();
  return messageTime > clearedAt;
};

const ChatPage = () => {
  const user = getUser();
  const socket = getSocket();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [demoChatMessages, setDemoChatMessages] = useState(() => (
    localStorage.getItem(DEMO_CHAT_CLEARED_KEY) === 'true' ? [] : demoMessages
  ));
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [smartReplies, setSmartReplies] = useState([]);
  const [pendingConnections, setPendingConnections] = useState([]);
  const [showPending, setShowPending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await chatAPI.getMessages(selectedChat._id);
      const clearedAt = getClearedAt(selectedChat._id);
      setMessages(response.data.messages.filter(message => isAfterClearTime(message, clearedAt)));
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  }, [selectedChat]);

  const initializeSocket = useCallback(() => {
    socket.on('receiveMessage', (data) => {
      if (selectedChat && selectedChat._id === data.chatId) {
        const clearedAt = getClearedAt(selectedChat._id);
        if (isAfterClearTime(data, clearedAt)) {
          setMessages(prev => [...prev, data]);
        }
      }
    });

    socket.on('smartReplySuggestions', (data) => {
      setSmartReplies(data.smartReplies);
    });

    socket.on('userTyping', (data) => {
      if (selectedChat && data.senderId !== user.id) {
        setIsTyping(true);
      }
    });

    socket.on('userStoppedTyping', () => {
      setIsTyping(false);
    });
  }, [selectedChat, socket, user.id]);

  useEffect(() => {
    fetchChats();
    fetchPendingConnections();
  }, []);

  useEffect(() => {
    initializeSocket();

    return () => {
      socket.off('receiveMessage');
      socket.off('smartReplySuggestions');
      socket.off('userTyping');
      socket.off('userStoppedTyping');
    };
  }, [initializeSocket, socket]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
    }
  }, [fetchMessages, selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChats = async () => {
    try {
      const response = await chatAPI.getChatList();
      setChats(response.data.chats);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching chats:', err);
      setLoading(false);
    }
  };

  const fetchPendingConnections = async () => {
    try {
      const response = await connectionAPI.getPending();
      setPendingConnections(response.data.connections);
    } catch (err) {
      console.error('Error fetching pending connections:', err);
    }
  };

  const emitMessage = (message, receiverId) => {
    socket.emit('sendMessage', {
      _id: message._id,
      chatId: message.chatId,
      senderId: user.id,
      receiverId,
      messageType: message.messageType,
      messageText: message.messageText,
      audioUrl: message.audioUrl,
      audioMimeType: message.audioMimeType,
      audioDuration: message.audioDuration,
    });
  };

  const handleSendMessage = async (text) => {
    if (!selectedChat) return;

    const receiverId = selectedChat.users.find(u => u._id !== user.id)?._id;
    
    if (!text.trim()) return;

    try {
      const response = await chatAPI.saveMessage({
        chatId: selectedChat._id,
        receiverId,
        messageText: text.trim(),
        messageType: 'text',
      });

      setMessages(prev => [...prev, response.data.message]);
      emitMessage(response.data.message, receiverId);

      setNewMessage('');
      setSmartReplies([]);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send message');
    }
  };

  const handleClearChat = async () => {
    if (!selectedChat) {
      localStorage.setItem(DEMO_CHAT_CLEARED_KEY, 'true');
      setDemoChatMessages([]);
      setNewMessage('');
      setSmartReplies([]);
      return;
    }

    if (!window.confirm('Clear this chat history? This cannot be undone.')) return;

    const clearedAt = Date.now();
    markChatCleared(selectedChat._id, clearedAt);
    setMessages([]);
    setNewMessage('');
    setSmartReplies([]);

    try {
      await chatAPI.clearMessages(selectedChat._id);
      fetchChats();
    } catch (err) {
      console.error('Server could not clear chat history:', err);
    }
  };

  const handleAcceptConnection = async (connectionId) => {
    try {
      await connectionAPI.acceptRequest({ connectionId });
      fetchChats();
      fetchPendingConnections();
      alert('Connection accepted!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept connection');
    }
  };

  const handleTyping = () => {
    if (selectedChat) {
      const receiverId = selectedChat.users.find(u => u._id !== user.id)?._id;
      socket.emit('typing', {
        senderId: user.id,
        receiverId,
      });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getOtherUser = () => {
    return selectedChat?.users.find(u => u._id !== user.id);
  };

  const visibleMessages = selectedChat ? messages : demoChatMessages;

  if (loading) {
    return (
      <div className="app-dark">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <main className="messages-page">
      <section className="discord-shell">


        <section className="conversation-panel">
          <header className="conversation-header">
            <div><span>#</span><strong>general</strong><small>Chat about anything here!</small></div>
            <div className="header-actions">
              <button type="button" className="clear-chat-button" onClick={handleClearChat}>Clear chat</button>
              <div className="header-icons"><span>●</span><span>♟</span><input aria-label="Search" /><span>?</span></div>
            </div>
          </header>

          <div className="conversation-body">
            {visibleMessages.length === 0 && (
              <div className="empty-chat">
                <strong>No messages yet</strong>
                <span>Start a fresh conversation below.</span>
              </div>
            )}
            {visibleMessages.map((msg, index) => {
              const isReal = Boolean(selectedChat);
              const sender = isReal ? (msg.senderId?._id === user.id ? user : getOtherUser()) : msg;
              const name = isReal ? (sender?.alias || 'You') : msg.name;
              const text = isReal ? msg.messageText : msg.text;
              const time = isReal ? new Date(msg.createdAt).toLocaleTimeString() : msg.time;
              return (
                <article key={msg._id || `${msg.name}-${index}`} className="feed-message">
                  <span className={`avatar ${msg.tone || 'purple'}`}>{name?.charAt(0)}</span>
                  <div>
                    <p><strong>{name}</strong><small>{time}</small></p>
                    {msg.messageType === 'voice' && msg.audioUrl ? (
                      <audio controls src={`${MEDIA_URL}${msg.audioUrl}`}></audio>
                    ) : (
                      <span>{text}</span>
                    )}
                    {msg.image && <div className="sneak-peek"></div>}
                  </div>
                </article>
              );
            })}
            {isTyping && <div className="typing-indicator"><span></span><span></span><span></span></div>}
            <div ref={messagesEndRef} />
          </div>

          {smartReplies.length > 0 && (
            <div className="smart-replies dark-replies">
              {smartReplies.map((reply, idx) => (
                <button key={idx} onClick={() => handleSendMessage(reply)} className="smart-reply">{reply}</button>
              ))}
            </div>
          )}

          <div className="composer">
            <textarea
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              placeholder="Message #general"
              rows="1"
            />
            <button type="button" className="send-button" onClick={() => handleSendMessage(newMessage)}>Send</button>
          </div>
        </section>

        <aside className="members-panel">
          {pendingConnections.length > 0 && (
            <>
              <p className="panel-label">Pending Connections — {pendingConnections.length}</p>
              <button onClick={() => setShowPending(!showPending)} className="pending-toggle">
                {showPending ? 'Hide' : 'Show'} Pending
              </button>
              {showPending && pendingConnections.map(conn => (
                <button key={conn._id} onClick={() => handleAcceptConnection(conn._id)} className="pending-toggle">
                  Accept {conn.senderId.alias}
                </button>
              ))}
            </>
          )}
          
          <p className="panel-label">Direct Messages</p>
          {(chats.length ? chats : directUsers).map((item, index) => {
            const otherUser = item.users?.find(u => u._id !== user.id);
            const label = otherUser?.alias || item.name;
            const online = otherUser?.isOnline ?? item.mood !== 'offline';
            return (
              <div
                key={item._id || label}
                onClick={() => item._id && setSelectedChat(item)}
                className="member-row"
                style={{ cursor: 'pointer' }}
              >
                <span className={`avatar ${item.tone || 'blue'}`}>{label?.charAt(0)}</span>
                <span><strong>{label}</strong><small>{online ? 'Online' : 'Offline'}</small></span>
              </div>
            );
          })}
          {['Noah', 'Ethan'].map(name => (
            <div key={name} className="member-row offline">
              <span className="avatar purple">{name.charAt(0)}</span>
              <span><strong>{name}</strong><small>Offline</small></span>
            </div>
          ))}
        </aside>
      </section>
    </main>
  );
};

export default ChatPage;
