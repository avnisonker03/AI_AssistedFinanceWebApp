import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token is required' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired access token' });
    console.log("payload",payload)
    req.userId = payload.userId;
    req.email = payload.email
    next(); 
  });
};
