const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
require('dotenv').config();

// Import models to register them with Sequelize
require('./models/User');
require('./models/Event');
require('./models/Booking');

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

app.get('/', (req, res) => res.send('Event Booking API is running'));

const PORT = process.env.PORT || 5000;

sequelize.authenticate().then(() => {
  console.log('Database connected successfully');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => {
  console.error('Failed to connect to database:', err.message);
});
