const User = require('../models/User');                 // Import User model (Mongoose schema for users)
const bcrypt = require('bcrypt');                       // Library for hashing passwords securely
const asyncHandler = require('express-async-handler');  // Wrapper to catch async errors and forward them to Express error middleware

/**
 * @description Create New Customer (User Registration)
 * @route POST /api/users/auth/registration
 * @access Public
 * 
 * This endpoint allows new customers to register in the system.
 * Steps:
 * 1. Validate input fields.
 * 2. Check if the email is already registered.
 * 3. Hash the password for secure storage.
 * 4. Create a new user with role defaulting to 'customer'.
 * 5. Send a success or error response.
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

module.exports = {
    registration
};
