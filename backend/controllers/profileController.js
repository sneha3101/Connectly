const Profile = require('../models/Profile');
const User = require('../models/User');

// Create or update profile
const upsertProfile = async (req, res) => {
  try {
    const { catchLine, interests } = req.body;
    const userId = req.userId;

    let profile = await Profile.findOne({ userId });

    if (profile) {
      profile.catchLine = catchLine;
      profile.interests = interests;
      profile.updatedAt = new Date();
      await profile.save();
    } else {
      profile = new Profile({
        userId,
        catchLine,
        interests,
        visibilityStatus: 'public',
      });
      await profile.save();
    }

    res.json({
      message: 'Profile updated successfully',
      profile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// Get profile by user ID
const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await Profile.findOne({ userId }).populate('userId', 'alias interests');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({ profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

// Get all public profiles (for dashboard)
const getAllPublicProfiles = async (req, res) => {
  try {
    const { interests } = req.query;
    const userId = req.userId;

    let query = { visibilityStatus: 'public' };

    if (interests) {
      const interestList = interests.split(',');
      query.interests = { $in: interestList };
    }

    const profiles = await Profile.find(query)
      .populate('userId', 'alias interests isOnline')
      .where('userId').ne(userId)
      .limit(20);

    res.json({ profiles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching profiles', error: error.message });
  }
};

module.exports = {
  upsertProfile,
  getProfile,
  getAllPublicProfiles,
};
