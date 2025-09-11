const User = require('../models/User');                 // Import User model (Mongoose schema for users)
const bcrypt = require('bcrypt');                       // Library for hashing passwords securely
const jwt = require('jsonwebtoken');                    // Library for
const asyncHandler = require('express-async-handler');  // Wrapper to catch async errors and forward them to Express error middleware

/**
 * @description User Registration
 * @route POST /api/users/auth/registration
 * @access Public
 */
const registration = asyncHandler(async (req, res) => {
    // Extract required fields from the request body
    const { firstname, lastname, email, password } = req.body;

    // Step 1: Validate input → All fields must be present
    if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Step 2: Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Step 3: Securely hash the password before saving
    // The "10" is the salt rounds → higher number = stronger but slower hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 4: Create a new user in the database
    // By default, role = "customer" from the User schema
    const newCustomer = await User.create({
        firstname,
        lastname,
        email,
        password: hashedPassword
    });

    // Step 5: Handle case where creation failed
    if (!newCustomer) {
        return res.status(400).json({ message: 'Invalid user credentials' });
    }

    // If everything is fine, send success response
    res.status(201).json({ message: 'New customer successfully created' });
});


/**
 * @description User Login
 * @route POST /api/user/auth/login
 * @access Public
 */
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Step 1: Basic validation: make sure both fields are provided
    if (!email || !password) {
        return res.status(400).json({ message: 'Provide email and password' });
    }

    // Step 2: Look up the user by email
    const user = await User.findOne({ email });
    if (!user) {
        // Do NOT say "user not found" (security best practice: always use generic msg)
        return res.status(404).json({ message: 'Invalid credentials' });
    }

    // Step 3: Verify password
    let match = false;

    // First try matching against permanent password (if set)
    if (user.password) {
        match = await bcrypt.compare(password, user.password);
    }

    // If no match, try temporary password (used for staff accounts at first login)
    if (!match && user.temporaryPassword) {
        match = await bcrypt.compare(password, user.temporaryPassword);
    }

    // If neither matched → fail login
    if (!match) {
        return res.status(400).json({ message: 'Invalid credentials!' });
    }

    // Step 4: Generate Access Token (short-lived)
    //    - This is returned in the response body
    //    - Used in Authorization headers for API calls
    const token = jwt.sign(
        {
            id: user._id,  // unique user identifier
            role: user.role, // role-based access control

        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' } // short-lived (good security practice)
    );

    // Step 5: Generate Refresh Token (long-lived)
    //    - Stored in an HttpOnly cookie
    //    - Used to request new access tokens
    const refresh = jwt.sign(
        {
            id: user._id,
            role: user.role,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' } // lasts 7 days
    )

    // Step 6: Store refresh token in a secure cookie
    //    - HttpOnly → not accessible via JavaScript (mitigates XSS attacks)
    //    - secure: true → cookie only sent over HTTPS
    //    - sameSite: 'None' → allows cross-site requests (needed if FE + BE are on different domains)
    //    - maxAge: 7 days
    res.cookie("jwt", refresh, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    // Step 7: Return access token in response
    //    - Frontend should store this in memory (not localStorage) and attach to requests
    res.status(200).json({ token });
});


/**
 * @description Logout user
 * @route POST /api/users/auth/logout
 * @access Public
 */
const logout = asyncHandler(async (request, response) => {
    // 1. Read cookies from the request
    const cookies = request.cookies;

    // 2. If no cookie is found, there's nothing to log out.
    //    Use HTTP 204 (No Content) to indicate nothing to clear.
    if (!cookies?.jwt) {
        return response.sendStatus(204);
    }

    // 3. Clear the cookie by name.
    //    Options MUST match the ones used when setting the cookie (login).
    response.clearCookie('jwt', {
        httpOnly: true,  // prevent JS access
        secure: true,    // ensures cookie only sent over HTTPS
        sameSite: 'none' // allows cross-site cookie usage (needed if frontend/backend are on different domains)
    });

    // 4. Respond success
    return response.status(200).json({ message: 'Logged out successfully.' });
});


module.exports = {
    registration,
    login,
    logout
};
