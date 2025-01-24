const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const classRoutes = require('./routes/classRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const materialRoutes = require('./routes/materialRoutes');
const setupSwagger = require('./swagger');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1); // Exit the process if MongoDB connection fails
  });

app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/materials', materialRoutes);

setupSwagger(app);

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
