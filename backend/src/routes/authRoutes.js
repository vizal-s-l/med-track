const express = require('express');
const {
  signup,
  login,
  logout,
  getMe,
  startGoogleOAuth,
} = require('../controllers/authController');
const { authenticateUser } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', authenticateUser, logout);
router.get('/me', authenticateUser, getMe);
router.post('/google', startGoogleOAuth);

module.exports = router;
