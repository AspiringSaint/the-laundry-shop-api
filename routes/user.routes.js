const router = require('express').Router();
const {
    getProfileById,
    updateProfileById
} = require('../controllers/user.controller');

// Profile
router.get('/profile/view', getProfileById);
router.patch('/profile/update', updateProfileById);

// Admin CRUD


module.exports = router;