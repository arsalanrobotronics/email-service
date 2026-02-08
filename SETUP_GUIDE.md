# Email Engine Setup Guide

Complete setup instructions for AARC Solutions email engine.

## 📋 Prerequisites

- Node.js v18+ installed
- Gmail account (or any SMTP email service)
- Both frontend and backend folders ready

## 🚀 Backend Setup

### 1. Navigate to Backend Folder
```bash
cd systems-ltd-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` file with your credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Company Email
COMPANY_EMAIL=info@aarcsolution.com

# Frontend URL
FRONTEND_URL=http://localhost:8080
```

### 4. Gmail App Password Setup (Important!)

**Gmail requires App Password for SMTP:**

1. Go to Google Account Settings
2. Enable 2-Factor Authentication
3. Go to Security → App Passwords
4. Generate new app password for "Mail"
5. Copy the 16-character password
6. Paste it in `EMAIL_PASSWORD` in `.env`

**Alternative Email Services:**
- **Outlook/Hotmail:** smtp-mail.outlook.com, Port 587
- **Yahoo:** smtp.mail.yahoo.com, Port 587
- **SendGrid:** smtp.sendgrid.net, Port 587 (requires API key)

### 5. Start Backend Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on: `http://localhost:5000`

### 6. Test Backend

Open browser and visit:
```
http://localhost:5000/health
```

You should see:
```json
{
  "status": "OK",
  "message": "Email engine is running",
  "timestamp": "2024-..."
}
```

## 🎨 Frontend Setup

### 1. Navigate to Frontend Folder
```bash
cd systems-ltd.-clone-react
```

### 2. Environment Variable Already Created

`.env` file already has:
```env
VITE_API_URL=http://localhost:5000
```

### 3. Restart Frontend (if running)

Stop current dev server (Ctrl+C) and restart:
```bash
npm run dev
```

## ✅ Testing the Complete Flow

### 1. Start Both Servers

**Terminal 1 (Backend):**
```bash
cd systems-ltd-backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd systems-ltd.-clone-react
npm run dev
```

### 2. Test Contact Form

1. Open browser: `http://localhost:8080/contact`
2. Fill out the contact form:
   - Full Name: Test User
   - Email: test@example.com
   - Company: Test Company
   - Phone: +1234567890
   - Subject: Test Message
   - Message: This is a test message

3. Click "Send Message"

### 3. Expected Results

✅ **Success Toast:** "Message Sent! ✅"

✅ **Company Email (info@aarcsolution.com):** Receives formatted email with all form data

✅ **Client Email (test@example.com):** Receives thank you email

✅ **Backend Console:** Shows logs:
```
📨 Processing contact form submission from: test@example.com
✅ Email sent to company
✅ Thank you email sent to client
```

## 🐛 Troubleshooting

### Issue: "Failed to send email"

**Check:**
1. Email credentials in `.env` are correct
2. Gmail App Password is used (not regular password)
3. Backend server is running
4. Check backend console for error details

### Issue: "Network Error" or "Failed to fetch"

**Check:**
1. Backend server is running on port 5000
2. CORS is enabled (already configured)
3. Frontend `.env` has correct `VITE_API_URL`
4. Restart frontend after changing `.env`

### Issue: Email not received

**Check:**
1. Check spam/junk folder
2. Verify `COMPANY_EMAIL` in backend `.env`
3. Check backend console for errors
4. Test email credentials with a simple test

## 🚀 Deployment

### Backend Deployment (Railway/Render)

1. Push backend code to GitHub
2. Connect to Railway/Render
3. Set environment variables in platform
4. Deploy

### Frontend Deployment (Vercel/Netlify)

1. Update `.env` with production backend URL:
```env
VITE_API_URL=https://your-backend.railway.app
```

2. Deploy to Vercel/Netlify

### Important: Update CORS

In backend `.env` (production):
```env
FRONTEND_URL=https://your-frontend.vercel.app
```

## 📧 Email Templates

### Company Email Features:
- Professional gradient header
- All form fields clearly displayed
- Timestamp included
- Responsive design

### Client Email Features:
- Branded thank you message
- Call-to-action button
- Social media links
- Professional footer

## 🔒 Security Best Practices

✅ Never commit `.env` file (already in `.gitignore`)
✅ Use App Passwords, not regular passwords
✅ Input validation enabled (express-validator)
✅ CORS configured for specific frontend URL
✅ Rate limiting recommended for production

## 📝 API Documentation

### POST /api/contact

**Request:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "company": "ABC Corp",
  "phone": "+1234567890",
  "subject": "Inquiry",
  "message": "Hello, I'm interested..."
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Your message has been sent successfully!"
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [...]
}
```

## 🎯 Next Steps

1. ✅ Test locally with real email
2. ✅ Customize email templates (optional)
3. ✅ Deploy backend to Railway/Render
4. ✅ Update frontend `.env` with production URL
5. ✅ Deploy frontend to Vercel/Netlify
6. ✅ Test production deployment

## 💡 Tips

- Keep backend `.env` secure
- Monitor email sending limits (Gmail: 500/day)
- Consider using SendGrid for high volume
- Add rate limiting for production
- Set up error monitoring (Sentry)

---

**Need Help?** Check backend console logs for detailed error messages.
