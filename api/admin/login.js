import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;
    const validUsername = process.env.ADMIN_USERNAME;
    const validPassword = process.env.ADMIN_PASSWORD;

    if (!validUsername || !validPassword) {
      return res.status(500).json({ message: 'Admin credentials not configured' });
    }

    if (username === validUsername && password === validPassword) {
      const token = jwt.sign(
        { username: validUsername, role: 'admin' },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '7d' }
      );
      
      res.json({
        username: validUsername,
        token: token,
      });
    } else {
      res.status(401).json({ message: 'Invalid admin credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
