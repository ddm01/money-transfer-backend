const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Initialize Express App
const app = express();
app.use(bodyParser.json());

// Database Setup
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
});

// User Model
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [10, 10],
      isNumeric: true,
    },
  },
  nic: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [12, 12],
      isNumeric: true,
    },
  },
  paymentAccount: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Sync Database
sequelize.sync().then(() => {
  console.log('Database synced');
});

// Routes

// Register Route
app.post('/register', async (req, res) => {
  const { name, email, phone, nic, paymentAccount, password } = req.body;

  if (!name || !email || !phone || !nic || !paymentAccount || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (phone.length !== 10 || !/^\d+$/.test(phone)) {
    return res.status(400).json({ error: 'Phone number must be 10 digits' });
  }

  if (nic.length !== 12 || !/^\d+$/.test(nic)) {
    return res.status(400).json({ error: 'NIC must be 12 numeric characters' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      phone,
      nic,
      paymentAccount,
      password: hashedPassword,
    });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'An error occurred while registering' });
    }
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user.id, email: user.email }, 'secret-key', {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while logging in' });
  }
});

// Start the Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
