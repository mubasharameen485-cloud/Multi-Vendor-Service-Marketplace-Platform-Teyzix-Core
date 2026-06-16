import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { AuthContext } from '../../context/AuthContext';
import { Trash2 } from 'lucide-react'; // Make sure: npm install lucide-react

const socket = io('http://localhost:5000');

const ChatWindow = ({ receiverId, receiverName, onClose }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Fallback for ID (Handling both user.id and user._id)
  const myId = user?.id || user?._id; 
  const room = [myId, receiverId].sort().join('_');

  useEffect(() => {
    socket.emit('join_chat', room);

    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/chat/${receiverId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data.data);
        scrollToBottom();
      } catch (err) {
        console.error('Error fetching chat history', err);
      }
    };
    fetchHistory();

    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data.messageObj]);
      scrollToBottom();
    });

    socket.on('message_deleted', (deletedMsgId) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== deletedMsgId));
    });

    return () => {
      socket.off('receive_message');
      socket.off('message_deleted');
    };
  }, [receiverId, room, myId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/chat', {
        receiverId,
        text: newMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const savedMessage = res.data.data;
      socket.emit('send_message', { room, messageObj: savedMessage });
      setNewMessage('');
      scrollToBottom();
    } catch (err) {
      console.error('Error sending message', err);
    }
  };

  const deleteMessage = async (msgId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/chat/${msgId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update UI immediately
      setMessages((prev) => prev.filter((msg) => msg._id !== msgId));
      
      // Notify other user to delete from their screen
      socket.emit('delete_message', { room, msgId });
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting message');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[200] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col h-[500px] overflow-hidden">
        
        {/* Header */}
        <div className="bg-green-600 text-white p-4 flex justify-between items-center shadow-md">
          <div>
            <h3 className="font-bold text-lg leading-tight">{receiverName}</h3>
            <p className="text-xs text-green-100 font-medium">Live Chat</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-red-200 text-2xl leading-none">×</button>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#f8fafc] flex flex-col gap-4">
          {messages.map((msg) => {
            // Strong ID Check to ensure Dustbin shows up!
            const msgSenderId = typeof msg.sender === 'object' ? msg.sender._id : msg.sender;
            const isMe = String(msgSenderId) === String(myId);

            return (
              <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`relative max-w-[75%] px-4 py-2 rounded-2xl shadow-sm flex items-center gap-2 
                  ${isMe ? 'bg-green-500 text-white rounded-tr-none' : 'bg-white border text-gray-800 rounded-tl-none'}`}
                >
                  <p className="text-sm break-words">{msg.text}</p>
                  
                  {/* DUSTBIN ICON - No hidden classes, always slightly visible, full color on hover */}
                  {isMe && (
                    <button 
                      onClick={() => deleteMessage(msg._id)}
                      className="text-red-200 hover:text-red-900 bg-white/20 hover:bg-white/50 p-1.5 rounded-full transition-all ml-1"
                      title="Delete this message"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={sendMessage} className="p-3 bg-white border-t flex items-center gap-2">
          <input 
            type="text" 
            placeholder="Type your message..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-3 border-2 border-gray-100 rounded-full focus:outline-none focus:border-green-500 bg-gray-50 text-sm"
          />
          <button 
            type="submit" 
            disabled={!newMessage.trim()} 
            className="bg-green-600 text-white rounded-full w-12 h-12 flex justify-center items-center hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
          >
            <span className="text-xl leading-none">➤</span>
          </button>
        </form>

      </div>
    </div>
  );
};

export default ChatWindow;