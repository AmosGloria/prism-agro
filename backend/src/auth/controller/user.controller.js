const { get } = require("mongoose");
const { verifyNin, getUserByEmail, createUser, updateUserOtp } = require("../service/user.service");
const { hashPassword, generateToken, setTokenCookie, comparePassword } = require("../../helpers/jwt");
const { generateOtp } = require("../../helpers/otp");
const { sendMail } = require("../../helpers/email");

exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: 'Full name, email, and password are required'
      });
    }

    const userExists = await getUserByEmail(email);
    if (userExists) {
      return res.status(400).json({
        message: 'Email already in use'
      });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await createUser({
      fullName,
      email,
      password: hashedPassword
    });

    if (!newUser) {
      return res.status(500).json({
        message: 'Failed to register user'
      });
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp = await hashPassword(newOtp);

    const otpExpiryTime = new Date(Date.now() + 5 * 60 * 1000);

    await updateUserOtp(email, otp, otpExpiryTime);

    // 🚀 Send email in background
    await sendMail(
      email,
      'Your OTP Code',
      `Your OTP code is ${newOtp}. It will expire in 5 minutes.`
    ).catch(err => console.error('Email error:', err));

    return res.status(201).json({
      message: 'User registered successfully. Check your email for OTP.',
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || 'An error occurred during registration',
      details: error.details || null
    });
  }
};

  exports.resendOtp = async (req, res) => {
    const email = req.body.email;
    try {
      const user = await getUserByEmail(email);
  
      if (!user) {
        return res.status(400).json({
          message: "No user Found",
        });
      }
  
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const otp = await hashPassword(newOtp);
  
      const otpExpiryTime = new Date(Date.now() + 5 * 60 * 1000);
      await updateUserOtp(email, otp, otpExpiryTime);
      
  
      const subject = "Email Verification";
      const html = `<h1>Welcome</h1><p>Your OTP is ${newOtp} and it expires in 5 minutes</p>`;
      await sendMail(email, subject, html);
  
      return res.status(200).json({
        message: "OTP resent successfully",
      });
    } catch (error) {
        return res.status(error.status || 500).json({
            message: error.message || 'Internal Server Error',
            details: error.details || null
          });
  };
}

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        const user = await getUserByEmail(email);

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (!user.otp || !user.otpExpires) {
            return res.status(400).json({ message: 'No OTP found for this user' });
        }

        if (Date.now() > user.otpExpires) {
            return res.status(400).json({ message: 'OTP has expired' });
        }

        const isOtpValid = await comparePassword(otp, user.otp);

        if (!isOtpValid) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // OTP is valid, clear it from the database

        await updateUserOtp(email, null, null);

        const token = await generateToken({ id: user._id, email: user.email, role: user.role });
        await setTokenCookie(res, token);
        res.status(200).json({

            message: 'OTP verified successfully',
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            },
            token
        });

    } catch (error) {
        res.status(error.status || 500).json({
            message: error.message || 'An error occurred during OTP verification',
            details: error.details || null
        });
    }
}


exports.logIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

            const user = await getUserByEmail(email);

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

            const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = await generateToken({ id: user._id, email: user.email, role: user.role });
        await setTokenCookie(res, token);
        
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role            },
            token
        });

    } catch (error) {
        res.status(error.status || 500).json({
            message: error.message || 'An error occurred during login',
            details: error.details || null
        });
    }
}


