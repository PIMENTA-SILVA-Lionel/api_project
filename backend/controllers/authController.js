const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('151473528973-pqigqqb7fom4o1lt3ereknrd5ejjn3rj.apps.googleusercontent.com');

const googleLogin = async (req, res) => {
  const { id_token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: '151473528973-pqigqqb7fom4o1lt3ereknrd5ejjn3rj.apps.googleusercontent.com',
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const username = payload.name;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ username, email, googleId: payload.sub });
      await user.save();
    }

    const token = jwt.sign({ id: user._id, username: user.username }, 'your_jwt_secret_key', {
      expiresIn: '1h',
    });

    res.status(200).json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ message: 'Google login failed' });
  }
};

module.exports = { googleLogin };
