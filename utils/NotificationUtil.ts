import { accountSid, authToken, twilioNumber } from "../config";

/* ----------------- OTP ------------------- */
export const generateOtp = () => {
  // Generate 5 digit OTP
  const otp = Math.floor(10000 + Math.random() * 900000);
  let expiry = new Date();
  // Add Expiry Time for OTP to finish in 0.5 hours
  expiry.setTime(new Date().getTime() + (30 * 60 * 1000));
  return { otp, expiry };
}
/* ----------------- Notification ------------------- */
export const onRequestOtp = async (otp: number, toPhoneNumber: string) => {
  try {
    const accSid = accountSid;
    const autToken = authToken;
    const client = require('twilio')(accSid, autToken);
    const response = await client.messages.create({
      body: `Your OTP Token is ${otp}`,
      from: `${twilioNumber}`,
      to: `${toPhoneNumber}`
    });
    return response;
  } catch (err) {
    return false;
  }
}