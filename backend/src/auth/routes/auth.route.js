// user routes

const express = require('express');
const router = express.Router();
const { registerUser, verifyOtp, resendOtp } = require('../controller/user.controller');

router.post('/register', registerUser);
router.post("/verifyOtp", verifyOtp);
router.post("/resendOtp", resendOtp);

const userRoutes = router;

module.exports = userRoutes;