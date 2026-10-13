import http from 'http';
import mongoose from 'mongoose';
import { app, io, server } from '../server.js';
import User from '../models/User.js';
import Service from '../models/Service.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import Notification from '../models/Notification.js';

process.env.NODE_ENV = 'test';
process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/localmate_test';

let serverInstance = null;
let baseUrl = '';

export const startTestServer = async () => {
  if (mongoose.connection.name !== 'localmate_test') {
    if (mongoose.connection.readyState) {
      await mongoose.disconnect();
    }
    await mongoose.connect('mongodb://127.0.0.1:27017/localmate_test');
  }

  return new Promise((resolve) => {
    serverInstance = http.createServer(app);
    serverInstance.listen(0, '127.0.0.1', () => {
      const port = serverInstance.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve({ server: serverInstance, baseUrl });
    });
  });
};

export const stopTestServer = async () => {
  if (io) {
    try {
      io.close();
    } catch (e) {}
  }
  if (serverInstance) {
    await new Promise((resolve) => serverInstance.close(resolve));
  }
};

export const clearDatabase = async () => {
  if (mongoose.connection.readyState && mongoose.connection.name === 'localmate_test') {
    await User.deleteMany({});
    await Service.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    await Notification.deleteMany({});
  }
};

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${baseUrl}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const config = {
    method: options.method || 'GET',
    headers,
  };

  if (options.body) {
    config.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
  }

  const response = await fetch(url, config);
  let data = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  return {
    status: response.status,
    headers: response.headers,
    data,
  };
};
