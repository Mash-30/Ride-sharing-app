# Twilio SMS Setup Guide

## 🔧 **Current Status**
The OTP system is currently using console logging. To enable real SMS delivery:

## 📱 **Setup Twilio SMS (Optional)**

### 1. **Get Twilio Account**
1. Sign up at [https://www.twilio.com/](https://www.twilio.com/)
2. Get your Account SID and Auth Token from the console
3. Get a Twilio phone number

### 2. **Configure Environment Variables**
Add these to your `.env` file in `server/services/user-service/`:

```env
# Twilio SMS Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### 3. **Install Twilio Package**
```bash
cd server/services/user-service
npm install twilio
```

### 4. **Restart the Service**
```bash
npm start
```

## 🧪 **Testing Without Twilio**

If you don't want to set up Twilio right now:

1. **Check the server console** - OTP will be logged there
2. **Look for messages like**: `📱 OTP for +1234567890 is 1234`
3. **Use the OTP from console** to complete verification

## 💡 **Free Twilio Trial**
- Twilio offers a free trial with $15-20 credit
- Enough for testing and development
- No credit card required for trial

## 🔒 **Security Note**
- Never commit your Twilio credentials to git
- Use environment variables for all sensitive data
- Consider using a service like AWS SNS for production 