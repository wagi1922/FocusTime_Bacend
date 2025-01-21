const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1); // Keluar dari proses dengan kode 1 jika koneksi gagal
  }
};

module.exports = connectDB;

