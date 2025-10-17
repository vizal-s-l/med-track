const { authService } = require('../services/authService');

const signup = async (req, res) => {
  try {
    const { email, password, full_name } = req.body;
    const data = await authService.signUp({ email, password, full_name });
    res.status(201).json(data);
  } catch (error) {
    console.error('Signup error:', error);
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await authService.signIn({ email, password });
    res.json(data);
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ error: error.message });
  }
};

const logout = async (_req, res) => {
  try {
    await authService.signOut();
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(400).json({ error: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const result = await authService.getProfile(req.user.id);
    res.json(result);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
};

const startGoogleOAuth = async (req, res) => {
  try {
    const { code } = req.body;
    const data = await authService.startGoogleSignIn({ code, req });
    res.json(data);
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signup,
  login,
  logout,
  getMe,
  startGoogleOAuth,
};
