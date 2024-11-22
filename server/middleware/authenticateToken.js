// authenticateToken.js

import jwt from 'jsonwebtoken'

function authenticateToken(req, res, next) {
    // Extract the JWT token from the request headers
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        // If no token is provided, return a 401 Unauthorized response
        return res.status(401).json({ message: "Authentication token required" });
    }

    
    // Verify the token
    jwt.verify(token, 'littlecoder', (err, user) => {
        if (err) {
            // If the token is invalid, return a 403 Forbidden response
            return res.status(403).json({ message: "Invalid token" });
        }
        // If the token is valid, attach the user information to the request object
        req.userId = user.userId;
        next(); // Call the next middleware function in the chain
    });
}
export default authenticateToken;

