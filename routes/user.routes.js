const router = require('express').Router();
const {
    getProfileById
} = require('../controllers/user.controller');

// Profile
router.get('/profile/view', getProfileById);


// Admin CRUD


module.exports = router;