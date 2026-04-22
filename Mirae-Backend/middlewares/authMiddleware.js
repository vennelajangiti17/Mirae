// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  // Check if the request has the "Authorization: Bearer <token>" header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Isolate the token from the word "Bearer"
      token = req.headers.authorization.split(' ')[1];

      // Decode the token using your secret key (Your team should add JWT_SECRET to the .env file!)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the decoded user ID to the request object so the controller can use it
      req.user = { id: decoded.userId }; 

      // Everything is good, move on to the controller!
      next();
    } catch (error) {
      console.error("Token verification failed:", error.message);
      res.status(401).json({ error: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ error: "Not authorized, no token provided" });
  }
};

module.exports = { protect };
