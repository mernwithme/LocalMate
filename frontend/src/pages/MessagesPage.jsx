import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Send, Image, Search, CheckCheck, User, Paperclip } from 'lucide-react';
import API from '../services/api';
import toast from 'react-hot-toast';
import { handleImageError } from '../utils/imageFallback';

const MOCK_CONTACTS = [
  {
    user: {
      _id: 'usr-provider-001',
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      role: 'provider',
    },
    lastMessage: 'I will be there at 10:00 AM sharp with the electrical kit.',
    createdAt: '10:42 AM',
  },
  {
    user: {
      _id: 'usr-customer-001',
      name: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      role: 'customer',
    },
    lastMessage: 'Hi Marcus, please check the main circuit box in the garage.',
    createdAt: '09:15 AM',
  },
];

const INITIAL_MESSAGES = [
  {
    _id: 'm1',
    sender: 'usr-customer-001',
    recipient: 'usr-provider-001',
    content: 'Hi Marcus! Is 10:00 AM tomorrow still good for the wiring job?',
    createdAt: '10:30 AM',
  },
  {
    _id: 'm2',
    sender: 'usr-provider-001',
    recipient: 'usr-customer-001',
    content: 'Yes Sarah! I will be there at 10:00 AM sharp with the electrical kit.',
    createdAt: '10:42 AM',
  },
];

export default function MessagesPage() {
  const { user } = useAuth();
  const socket = useSocket();
  const [searchParams] = useSearchParams();

  const [contacts, setContacts] = useState(MOCK_CONTACTS);
  const [activeContact, setActiveContact] = useState(MOCK_CONTACTS[0]);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (socket && user) {
      socket.emit('join_room', user._id);

      socket.on('receive_message', (msg) => {
        setMessages((prev) => [...prev, msg]);
      });

      return () => {
        socket.off('receive_message');
      };
    }
  }, [socket, user]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msgObj = {
      _id: 'msg-' + Date.now(),
      sender: user?._id || 'usr-customer-001',
      recipient: activeContact.user._id,
      content: newMessage,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, msgObj]);

    if (socket) {
      socket.emit('send_message', { recipientId: activeContact.user._id, message: msgObj });
    }

    setNewMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="glass-card rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[700px]">
        
        <div className="md:col-span-1 border-r border-slate-200 dark:border-slate-800 flex flex-col">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white mb-3">Messages & Chats</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {contacts.map((c) => (
              <button
                key={c.user._id}
                onClick={() => setActiveContact(c)}
                className={`w-full p-4 text-left flex items-center gap-3 transition-colors ${
                  activeContact?.user._id === c.user._id
                    ? 'bg-blue-50/70 dark:bg-blue-950/40'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <img src={c.user.avatar} alt={c.user.name} onError={(e) => handleImageError(e, 'avatar')} className="w-11 h-11 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-xs text-slate-900 dark:text-white truncate">{c.user.name}</span>
                    <span className="text-[10px] text-slate-400">{c.createdAt}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{c.lastMessage}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col h-full bg-slate-50/50 dark:bg-slate-950/50">
          
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <img src={activeContact?.user.avatar} alt={activeContact?.user.name} onError={(e) => handleImageError(e, 'avatar')} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{activeContact?.user.name}</h3>
                <span className="text-[10px] font-semibold text-emerald-500 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Online Now
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((m) => {
              const isMine = m.sender === (user?._id || 'usr-customer-001');
              return (
                <div key={m._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs space-y-1 shadow-sm ${
                      isMine
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-none border border-slate-200/60 dark:border-slate-700'
                    }`}
                  >
                    <p>{m.content}</p>
                    <span className={`text-[10px] block text-right ${isMine ? 'text-blue-200' : 'text-slate-400'}`}>
                      {m.createdAt}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
