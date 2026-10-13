import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Resolve socket server URL:
    // 1. Explicit VITE_BACKEND_URL or VITE_API_URL without /api suffix
    // 2. Localhost fallback when running locally on Vite dev server
    let socketUrl = null;

    if (import.meta.env.VITE_BACKEND_URL) {
      socketUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, '');
    } else if (import.meta.env.VITE_API_URL) {
      socketUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '').replace(/\/+$/, '');
    } else if (
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.port === '5173')
    ) {
      socketUrl = 'http://localhost:5000';
    }

    // In production without backend URL, prevent endless 404 polling against Vercel static origin
    if (!socketUrl) {
      console.warn(
        '⚠️ Socket.io server URL not configured. Real-time chat requires VITE_BACKEND_URL in your Vercel environment variables.'
      );
      return;
    }

    const newSocket = io(socketUrl, {
      autoConnect: true,
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
