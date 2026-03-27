// user routes

const express = require('express');
const router = express.Router();
const { registerUser, verifyOtp, resendOtp, logIn } = require('../controller/user.controller');

router.post('/register', registerUser);
router.post("/verifyOtp", verifyOtp);
router.post("/resendOtp", resendOtp);
router.post("/login", logIn)

const userRoutes = router;

module.exports = userRoutes;