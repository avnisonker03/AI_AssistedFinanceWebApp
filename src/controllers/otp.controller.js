import otpService from "../utils/redis.config.js"

export const sendOtp=(async(req,res)=>{
    try {
        const { email } = req.body;
        const result = await otpService.sendOTP(email);
        res.json(result);
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
})


export const verifyOtp=(async(req,res)=>{
    try {
        const { email, otp } = req.body;
        const result = await otpService.verifyOTP(email, otp);
        res.json(result);
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
})