// routes/authRoutes.js
import express from 'express';
import {
  signup,
  signin,
  google,
  signOut,

} from '../controllers/authController.js';

const router = express.Router();

// Auth routes
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google);
router.get('/signout', signOut);



export default router;
