// controllers/authController.js

import User from '../models/userModels.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

// SIGNUP
export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(errorHandler(400, 'Name, email, and password are required'));
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler(400, 'User already registered'));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Create token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

    res
      .cookie('access_token', token, { httpOnly: true })
      .status(201)
      .json({ success: true, user: { name: newUser.name, email: newUser.email, avatar: newUser.avatar } });
  } catch (err) {
    next(errorHandler(500, err.message));
  }
};

// SIGNIN
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(400, 'Email and password are required'));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found!'));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;

    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json({ success: true, user: rest });
  } catch (error) {
    next(error);
  }
};

// GOOGLE AUTH
export const google = async (req, res, next) => {
  try {
    const { name, email, avatar } = req.body;

    if (!email || !name) {
      return next(errorHandler(400, 'Name and email are required for Google signup'));
    }

    let user = await User.findOne({ email });

    if (user) {
      // User exists → login
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      return res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json({ success: true, user: rest });
    }

    // Create new user
    const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

    user = new User({
      name,
      email,
      password: hashedPassword,
      avatar, // match model
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = user._doc;

    res
      .cookie('access_token', token, { httpOnly: true })
      .status(201)
      .json({ success: true, user: rest });
  } catch (error) {
    next(error);
  }
};

// SIGNOUT
export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json({ success: true, message: 'User has been logged out!' });
  } catch (error) {
    next(error);
  }
};
