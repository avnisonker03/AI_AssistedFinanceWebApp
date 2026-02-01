

import nodemailer from "nodemailer";
import Redis from "ioredis";

// Redis connection
const redis = new Redis(
  // host: process.env.REDIS_HOST || 'localhost',
  // port: process.env.REDIS_PORT || 6379,
//   password: process.env.REDIS_PASSWORD
process.env.REDIS_URL, {
  maxRetriesPerRequest: 1,
  connectTimeout: 10000, // 10 seconds
});

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis error", err);
});

// Email configuration
const transporter = nodemailer.createTransport({
  // service: 'gmail',
  // host: "smtp.gmail.com",
  // port: 465,        // SSL
  // secure: true,     // must be true for SSL
  // auth: {
  //   user: process.env.EMAIL_USER,
  //   pass: process.env.EMAIL_PASSWORD
  // }
  host: "smtp.sendgrid.net",
  port: 465,
  secure: true,
  connectionTimeout: 5000, // 5 seconds
  greetingTimeout: 5000,
  auth: {
    user: "apikey", // literally this string
    pass: process.env.SENDGRID_API_KEY,
  },
});

class OTPService {
  // Generate 6 digit OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send OTP to email
  async sendOTP(email) {
    try {
      // Generate OTP
      const otp = this.generateOTP();
      
      // Store OTP in Redis with 10 minutes expiry
      console.log("DEBUG: Attempting Redis SET for", email);
      await redis.set(`otp:${email}`, otp, 'EX', 120);
      console.log("DEBUG: Redis SET successful");
      // Send email
      const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: 'Your OTP Code',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Your OTP Code</h2>
            <p>Your verification code is: <strong style="font-size: 24px;">${otp}</strong></p>
            <p>This code will expire in 2 minutes.</p>
          </div>
        `
      };
      console.log("DEBUG: Attempting Email Send via SendGrid...",mailOptions);
      await transporter.sendMail(mailOptions);
      return { success: true, message: 'OTP sent successfully' };

    } catch (error) {
      console.error('Error sending OTP:', error);
      throw new Error('Failed to send OTP');
    }
  }

  // Verify OTP
  async verifyOTP(email, submittedOTP) {
    try {
      // Get stored OTP
      const storedOTP = await redis.get(`otp:${email}`);

      // Check if OTP exists and matches
      if (!storedOTP) {
        throw new Error('OTP expired or not found');
      }

      if (storedOTP !== submittedOTP) {
        throw new Error('Invalid OTP');
      }

      // Delete OTP after successful verification
      await redis.del(`otp:${email}`);

      return { success: true, message: 'OTP verified successfully' };

    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  }
}

export default new OTPService();