const router = require('express').Router();
const {
    getProfileById,
    updateProfileById,
    deleteProfileById
} = require('../controllers/user.controller');

// Profile
router.get('/profile/view', getProfileById);
router.patch('/profile/update', updateProfileById);
router.delete('/profile/delete', deleteProfileById);

// Admin CRUD


module.exports = router;