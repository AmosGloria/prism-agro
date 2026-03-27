require("dotenv").config()
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const jwtService={
    async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
      },
      async comparePassword(password, hashedPassword) {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
      },
      async setTokenCookie(res, token) {
        const cookieOptions = {
          httpOnly: true,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        };
        res.cookie("token", token, cookieOptions);
      },
      async generateToken(payload) {
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRES_IN });
        return token;
      },
      async verifyToken(token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
      },
    
}

module.exports = jwtService