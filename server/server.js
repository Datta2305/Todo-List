require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Models
// const UserSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true }
// });

// UserSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 12);
//   next();
// });

const TodoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  dueDate: Date,
  completed: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

// const User = mongoose.model('User', UserSchema);

const User = require('./models/User'); // Adjust path as needed
const Todo = mongoose.model('Todo', TodoSchema);

// Middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    res.status(401).send({ error: 'Please authenticate' });
  }
};

// Rate Limiter Middleware
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: { error: 'Too many attempts, please try again later.' }
});

// Routes
// Auth Routes

app.use('/api/login', authLimiter);
app.use('/api/register', authLimiter);

const refreshTokens = [];

app.post('/api/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).send({ user, token });
  } catch (err) {
    console.error('Error in /api/register:', err);
    // Handle duplicate key error from MongoDB
    if (err.code === 11000) {
      return res.status(400).send({ error: 'Username or email already exists' });
    }
    res.status(400).send({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !await bcrypt.compare(req.body.password, user.password)) {
      return res.status(401).send({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    refreshTokens.push(refreshToken);
    res.send({ user, token, refreshToken });
  } catch (err) {
    res.status(400).send(err);
  }
});

// Endpoint to refresh token
app.post('/api/refresh-token', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    return res.status(403).send({ error: 'Refresh token not found, login again' });
  }
  try {
    const userData = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const token = jwt.sign({ id: userData.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.send({ token });
  } catch (err) {
    res.status(403).send({ error: 'Invalid refresh token' });
  }
});

app.post('/api/logout', (req, res) => {
  const { refreshToken } = req.body;
  const index = refreshTokens.indexOf(refreshToken);
  if (index > -1) refreshTokens.splice(index, 1);
  res.send({ message: 'Logged out' });
});

// Todo Routes
app.post('/api/todos', authenticate, async (req, res) => {
  try {
    const todo = new Todo({ ...req.body, userId: req.user._id });
    await todo.save();
    res.status(201).send(todo);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/api/todos', authenticate, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user._id });
    res.send(todos);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.patch('/api/todos/:id', authenticate, async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!todo) return res.status(404).send();
    res.send(todo);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.delete('/api/todos/:id', authenticate, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!todo) return res.status(404).send();
    res.send(todo);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Request password reset
app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ error: 'Email not found' });

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email content
    const resetLink = `https://todo-list-datta.vercel.app/reset-password/${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset',
      text: `You requested a password reset. Click the link to reset your password: ${resetLink}`,
      html: `<p>You requested a password reset.</p>
             <p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.send({ message: 'Password reset link sent to your email.' });
  } catch (err) {
    console.error('Error in /api/forgot-password:', err);
    res.status(500).send({ error: 'Server error' });
  }
});

// Reset password
app.post('/api/reset-password/:token', async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) return res.status(400).send({ error: 'Invalid or expired token' });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.send({ message: 'Password has been reset successfully.' });
  } catch (err) {
    console.error('Error in /api/reset-password:', err);
    res.status(500).send({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));