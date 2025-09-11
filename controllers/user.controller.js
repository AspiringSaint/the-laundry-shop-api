const User = require('../models/User');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

/**
 * @description View user info
 * @route GET /api/users/profile/view
 * @access Private
 */
const getProfileById = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid User Id' });
    }

    const user = await User.findById(id).select('-password -temporaryPassword');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
})

module.exports = {
    getProfileById
};