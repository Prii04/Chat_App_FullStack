const express = require('express');
const { 
  registerUser, 
  authUser, 
  allUsers, 
  forgotPassword, 
  resetPassword 
} = require('../controllers/userControllers');
const { protect } = require('../middleware/authMiddleware');

//create an instance of router from express
const router = express.Router();

//use this router to handle user related routes
router.route('/').post(registerUser).get(protect, allUsers);   //(registration of user)
router.post('/login', authUser);
router.post('/forgot-password', forgotPassword);  // New route for forgot password
//router.post('/reset-password', resetPassword);    // New route for reset password
router.put('/reset-password/:token', resetPassword);

module.exports = router;

