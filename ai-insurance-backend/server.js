require('dotenv').config();  // load env variables first

const express = require('express');
const app = express();
const cors = require('cors');

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Import routes
const authRoutes = require('./routes/authRoutes');
const claimRoutes = require('./routes/claimRoutes');

// Connect database
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');

    // Keep one predictable account ready for demos.
    const demoEmail = 'saritha@gmail.com';
    const demoPasswordHash = await bcrypt.hash('1234', 10);
    await User.findOneAndUpdate(
      { email: demoEmail },
      { name: 'Saritha', email: demoEmail, password: demoPasswordHash },
      { upsert: true }
    );
    console.log('Demo user ready: saritha@gmail.com / 1234');
  })
  .catch((err) => console.log('DB Error', err));

// middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/claim', claimRoutes);

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend connected successfully' });
});

app.get('/', (req, res) => {
  res.send('Backend Running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});