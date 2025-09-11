const router = require('express').Router();
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const {
    getProfileById,
    updateProfileById,
    deleteProfileById
} = require('../controllers/user.controller');

// Profile
router.get('/profile/view', authenticate, getProfileById);
router.patch('/profile/update', updateProfileById);
router.delete('/profile/delete', deleteProfileById);

// Admin CRUD


module.exports = router;