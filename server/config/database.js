const mongoose = require('mongoose');

const connectDB = async (retryCount = 0) => {
  const maxRetries = 3;
  const retryDelay = 5000; // 5 seconds
  
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bharatkumbh';
    console.log(`Attempting to connect to MongoDB... (Attempt ${retryCount + 1}/${maxRetries + 1})`);
    console.log(`Connection string: ${mongoURI.replace(/:[^:@]+@/, ':****@')}`); // Hide password in logs
    
    // Connection options for better reliability
    const options = {
      serverSelectionTimeoutMS: 15000, // 15 seconds timeout (increased)
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      retryWrites: true,
      w: 'majority',
      // Remove family: 4 to allow both IPv4 and IPv6
    };
    
    const conn = await mongoose.connect(mongoURI, options);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Set up connection event handlers
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });
    
    return conn;
  } catch (error) {
    // Retry logic for DNS/network errors
    if ((error.message.includes('querySrv EREFUSED') || 
         error.message.includes('ENOTFOUND') ||
         error.message.includes('ETIMEDOUT')) && 
        retryCount < maxRetries) {
      console.error(`❌ Connection attempt ${retryCount + 1} failed: ${error.message}`);
      console.log(`⏳ Retrying in ${retryDelay / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      return connectDB(retryCount + 1);
    }
    console.error('❌ MongoDB connection error:', error.message);
    
    // Provide specific guidance based on error type
    if (error.message.includes('querySrv EREFUSED') || error.message.includes('ENOTFOUND')) {
      console.error('\n🔍 DNS/Network Error Detected:');
      console.error('   This usually means:');
      console.error('   1. ⚠️  MongoDB Atlas cluster is PAUSED (most common)');
      console.error('      → Go to: https://cloud.mongodb.com → Database → Resume cluster');
      console.error('   2. ⚠️  IP address not whitelisted');
      console.error('      → Go to: MongoDB Atlas → Network Access → Add 0.0.0.0/0');
      console.error('   3. ⚠️  DNS resolution issue');
      console.error('      → Check internet connection and firewall');
    } else if (error.message.includes('authentication failed')) {
      console.error('\n🔐 Authentication Error:');
      console.error('   → Check username and password in .env file');
    } else {
      console.error('\n💡 Please check:');
      console.error('   1. MONGODB_URI in .env file is correct');
      console.error('   2. MongoDB Atlas IP whitelist includes your IP (0.0.0.0/0 for development)');
      console.error('   3. Username and password are correct');
      console.error('   4. Network connection is active');
      console.error('   5. MongoDB Atlas cluster is running (not paused)');
    }
    
    // On Vercel/serverless, don't exit - let the function continue
    // The API will work but database operations will fail gracefully
    if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
      console.error('\n❌ Production mode requires MongoDB connection. Exiting...');
      process.exit(1);
    } else {
      console.warn('\n⚠️  Server will continue but database features will not work.');
      console.warn('⚠️  API endpoints will return errors until MongoDB is connected.');
      console.warn('\n📝 Quick Fix Steps:');
      console.warn('   1. Check MongoDB Atlas → Database → Is cluster running? (Resume if paused)');
      console.warn('   2. Check MongoDB Atlas → Network Access → Add 0.0.0.0/0');
      console.warn('   3. Verify MONGODB_URI environment variable is set correctly');
      console.warn('   4. Redeploy after fixing');
    }
  }
};

module.exports = connectDB;

