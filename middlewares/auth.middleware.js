const jwt = require('jsonwebtoken');

/**
 * @middleware authenticate
 * @description Verifies the JWT access token provided in the request headers.
 *              If valid, attaches decoded token info to the request object.
 *              If invalid or missing, denies access.
 */
const authenticate = (req, res, next) => {
    // Look for the Authorization header in the request
    // Standard format: "Authorization: Bearer <token>"
    const header = req.headers.authorization || req.headers.Authorization;

    // Step 1: Check if header exists and starts with "Bearer "
    if (!header?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' }); // No token provided
    }

    // Step 2: Extract token after "Bearer "
    const token = header.split(' ')[1];

    // Step 3: Verify the token using JWT secret
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
        if (error) {
            // Invalid or expired token
            return res.status(403).json({ message: 'Forbidden' });
        }

        // Save the entire decoded user payload
        req.user = decoded;

        next(); // Allow request to proceed
    });
};


/**
 * @middleware authorize
 * @description Restricts access based on user roles.
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        // Step 1: Ensure user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized: No user data found' });
        }

        // Step 2: Check if user's role is allowed
        if (!roles.includes(request.user.role)) {
            return res.status(403).json({ message: 'Forbidden: You do not have the right permissions' });
        }

        // Step 3: Role is valid → allow request
        next();
    };
};

module.exports = { authenticate, authorize };
