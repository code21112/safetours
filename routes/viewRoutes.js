const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');
// const userController = require('./../controllers/userController');
const bookingController = require('./../controllers/bookingController');

const router = express.Router();

router.get('/', authController.isLoggedIn, bookingController.createBookingCheckout, viewController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewController.getSignupForm);
router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-bookings', bookingController.createBookingCheckout, authController.protect, viewController.getMyBookings);

// router.post('/submit-user-data', authController.protect, viewController.updateUserData);
// router.get('/updateMe', authController.protect, userController.updateMe);

module.exports = router;