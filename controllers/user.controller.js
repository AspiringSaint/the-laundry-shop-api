const User = require('../models/User');                 // Mongoose User model
const mongoose = require('mongoose');                   // Mongoose library for working with MongoDB IDs, schemas, etc.
const asyncHandler = require('express-async-handler');  // Utility to avoid writing try/catch everywhere, automatically forwards errors to Express error handler

/**
 * @description View user profile by ID
 * @route GET /api/users/profile/view
 * @access Private 
 */
const getProfileById = asyncHandler(async (req, res) => {
    const { id } = req.user; // Extract user ID

    // Step 1: Validate ID format
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid User Id' });
    }

    // Step 2: Find user by ID, exclude sensitive fields (passwords)
    const user = await User.findById(id).select('-password -temporaryPassword');

    // Step 3: Handle case where user is not found
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Step 4: Send user info
    res.status(200).json(user);
});


/**
 * @description Update user profile by ID
 * @route PATCH /api/users/profile/update
 * @access Private
 */
const updateProfileById = asyncHandler(async (req, res) => {
    const { id } = req.user; // Extract user ID

    // Step 1: Validate ID format
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid User Id' });
    }

    // Step 2: Update user record with fields from `req.body`
    // ⚠️ WARNING: This is a direct update with user-provided body, which could lead to privilege escalation 
    // (e.g. updating their `role` to "admin"). Consider sanitizing allowed fields.
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });

    // Step 3: Handle not found
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Step 4: Return success response
    res.status(200).json({ message: 'User info updated' });
});


/**
 * @description Delete user by ID
 * @route DELETE /api/users/profile/delete
 * @access Private 
 */
const deleteProfileById = asyncHandler(async (req, res) => {
    const { id } = req.body;
    // ⚠️ You’re currently pulling the `id` from the request body.
    // In a REST API, it’s usually better to pass it in the URL:
    // DELETE /api/users/profile/:id → accessed via req.params.id
    // OR even safer: delete only the "currently logged in user" (req.user.id from JWT).

    // Step 1: Validate the ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid User Id' });
    }

    // Step 2: Try to delete user from DB
    const user = await User.findByIdAndDelete(id);

    // Step 3: Handle "not found"
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Step 4: Return success response
    res.status(200).json({ message: "User deleted successfully" });
});

module.exports = {
    getProfileById,
    updateProfileById,
    deleteProfileById
};
