import mongoose from 'mongoose';

export const connectDB = async () => {
  if (process.env.NODE_ENV === 'test') {
    const testUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/localmate_test';
    try {
      const conn = await mongoose.connect(testUri, { serverSelectionTimeoutMS: 3000 });
      console.log(`[MongoDB Test] Connected successfully to test database: ${conn.connection.name}`);
      return true;
    } catch (e) {
      console.error(`[MongoDB Test Error] Failed to connect to test database: ${e.message}`);
      return false;
    }
  }

  const primaryUri = process.env.MONGO_URI;
  const localUri = 'mongodb://127.0.0.1:27017/localmate';

  if (primaryUri) {
    try {
      const conn = await mongoose.connect(primaryUri, {
        serverSelectionTimeoutMS: 3000,
      });
      console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
      return true;
    } catch (error) {
      console.warn(`[MongoDB Warning] Primary connection failed: ${error.message}`);
      if (error.message.includes('bad auth')) {
        console.warn(`[MongoDB Auth Tip] Atlas authentication failed. Please verify your MongoDB Atlas username and password.`);
      }
    }
  }

  try {
    console.log(`[LocalMate] Connecting to local MongoDB at ${localUri}...`);
    const localConn = await mongoose.connect(localUri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[MongoDB] Connected successfully to local database: ${localConn.connection.host}`);
    return true;
  } catch (localError) {
    console.warn(`[MongoDB Warning] Local MongoDB connection unavailable: ${localError.message}`);
    console.log(`[LocalMate] Running in memory / mock fallback mode for development.`);
    return false;
  }
};
