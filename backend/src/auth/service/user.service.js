// user service
const User = require('../module/user.model');
const axios = require('axios');
const { getAccessToken } = require('../../utilities/interswitch.auth');

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // must be APP PASSWORD
  }
});

// Optional but recommended (runs once)
transporter.verify()
  .then(() => console.log('✅ Email server ready'))
  .catch(err => console.error('❌ Email config error:', err));

exports.createUser = async (fullName, email, password) => {
  try {
    const user = new User({
      fullName,
      email,
      password
    });

    return await user.save();

  } catch (error) {
    throw error;
  }
};

exports.getUserByEmail = async (email) => {
    try {
        return await User.findOne({ email });
    } catch (error) {
        throw error;
    }   
}

exports.getUserById = async (id) => {
    try {
        return await User.findById(id);
    } catch (error) {
        throw error;
    }   
}

// nin verification service with interswitch nin api
exports.verifyNin = async ({ firstName, lastName, nin }) => {
    try {
      const token = await getAccessToken();
  
      const response = await axios.post(
        'https://api-marketplace-routing.k8.isw.la/marketplace-routing/api/v1/verify/identity/nin',
        {
          firstName,
          lastName,
          nin
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      return response.data;
  
    } catch (error) {
      throw {
        status: error.response?.status || 500,
        message: 'NIN verification failed',
        details: error.response?.data || error.message
      };
    }
  };

  // update user otp
  exports.updateUserOtp = async (email, otp, otpExpires) => {
    try {
        return await User.findOneAndUpdate(
            { email },
            { otp, otpExpires },
            { new: true }
        );
    } catch (error) {
        throw error;
    } 
  };

  // send otp using nodemailer
  exports.sendMail = async (email, subject, text) => {
    try {
      const mailOptions = {
        from: `"Prism Agro" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        text
      };
  
      return await transporter.sendMail(mailOptions);
  
    } catch (error) {
      console.error('Mail error:', error);
      throw error;
    }
  };

exports.resendOtp = async (email) => {
    try {
        const user = await this.getUserByEmail(email);
        if (!user) {
            throw { status: 404, message: 'User not found' };
        }

        let otp = await generateOtp();
        const otpExpiryTime = Date.now() + 5 * 60 * 1000;

        otp = hashPassword(otp);

        await this.updateUserOtp(email, otp, otpExpiryTime);

        await this.sendMail(
            email,
            'Your OTP Code',
            `Your OTP code is ${otp}. It will expire in 5 minutes.`
        );

        return { message: 'OTP resent successfully' };
    } catch (error) {
        throw {
            status: error.status || 500,
            message: error.message || 'Failed to resend OTP',
            details: error.details || null
        };
    }
}