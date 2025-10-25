import bcryptjs from 'bcryptjs';
import User from '../models/userModels.js';
import { errorHandler } from '../utils/error.js';
import Listing from '../models/listingModel.js';

// Test route
export const test = (req, res) => {
  res.json({
    message: 'API route is working!',
  });
};

// Update user
export const updateUser = async (req, res, next) => {
  try {
    // ✅ Ensure only user can update own account
    if (!req.user || req.user.id !== req.params.id) {
      return next(errorHandler(401, 'You can only update your own account!'));
    }

    // ✅ Hash password if updated
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    if (!updatedUser) return next(errorHandler(404, 'User not found!'));

    // Exclude password in response
    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Delete user
export const deleteUser = async (req, res, next) => {
  try {
    if (!req.user || req.user.id !== req.params.id) {
      return next(errorHandler(401, 'You can only delete your own account!'));
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return next(errorHandler(404, 'User not found!'));

    // ✅ Clear JWT cookie
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    });

    res.status(200).json({ message: 'User has been deleted!' });
  } catch (error) {
    next(error);
  }
};

// Get all listings for a user
export const getUserListings = async (req, res, next) => {
  try {
    if (!req.user || req.user.id !== req.params.id) {
      return next(errorHandler(401, 'You can only view your own listings!'));
    }

    const listings = await Listing.find({ userRef: req.params.id });
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

// Get user info
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(errorHandler(404, 'User not found!'));

    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
