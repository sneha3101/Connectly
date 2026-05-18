const User = require('../models/User');
const { generateToken } = require('../utils/tokenUtils');
const { generateAlias } = require('../utils/aliasGenerator');

// Register user
const register = async (req, res) => {
  try {
    const { email, password, confirmPassword, interests } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const alias = generateAlias();

    user = new User({
      email,
      password,
      alias,
      interests: interests || [],
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        alias: user.alias,
        interests: user.interests,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        alias: user.alias,
        interests: user.interests,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        alias: user.alias,
        interests: user.interests,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};

module.exports = {
  register,
  login,
  getUserProfile,
};
