# 🚀 Quick Start Guide - AARC Solutions Email Engine

## ⚡ Fast Setup (5 Minutes)

### Step 1: Install Dependencies
```bash
cd systems-ltd-backend
npm install
```

### Step 2: Create `.env` File
```bash
# Copy the example file
copy .env.example .env
```

### Step 3: Add Your Credentials

Open `.env` file and update these 2 lines:

```env
EMAIL_USER=info@aarcsolution.com
EMAIL_PASSWORD=your-actual-godaddy-password
```

**That's it!** Everything else is pre-configured for GoDaddy.

### Step 4: Start Backend
```bash
npm run dev
```

You should see:
```
🚀 Starting AARC Solutions Email Engine...

✅ Email configuration validated
✅ Email service connected successfully
📤 Emails will be sent from: info@aarcsolution.com
✅ Server running on port 5000
🌐 Environment: development
🔗 API: http://localhost:5000
📧 Company Email: info@aarcsolution.com

💡 Ready to accept contact form submissions!
```

### Step 5: Start Frontend (New Terminal)
```bash
cd systems-ltd.-clone-react
npm run dev
```

### Step 6: Test
1. Open: `http://localhost:8080/contact`
2. Fill the form
3. Click "Send Message"
4. Check both emails! ✅

---

## 🔧 Configuration Details

### Default Settings (Already Configured):
```env
EMAIL_HOST=smtpout.secureserver.net    # GoDaddy SMTP
EMAIL_PORT=465                          # Secure port
EMAIL_SECURE=true                       # SSL enabled
COMPANY_EMAIL=info@aarcsolution.com    # Where emails go
FRONTEND_URL=http://localhost:8080     # CORS allowed
```

### What You Need to Add:
```env
EMAIL_USER=info@aarcsolution.com           # Your GoDaddy email
EMAIL_PASSWORD=your-godaddy-password       # Your email password
```

---

## 🐛 Troubleshooting

### ❌ "Email configuration error"
**Solution:** Check your EMAIL_USER and EMAIL_PASSWORD in `.env`

### ❌ "Authentication failed"
**Solution:** 
1. Verify password is correct
2. Try alternative port:
```env
EMAIL_PORT=587
EMAIL_SECURE=false
```

### ❌ "Connection timeout"
**Solution:** Check internet connection and firewall settings

### ❌ Frontend shows "Network Error"
**Solution:** Make sure backend is running on port 5000

---

## 🌐 Production Deployment

### Backend (Railway/Render):
1. Push code to GitHub
2. Connect to Railway/Render
3. Add environment variables:
   - `EMAIL_USER`
   - `EMAIL_PASSWORD`
   - `FRONTEND_URL` (your production frontend URL)
4. Deploy

### Frontend (Vercel/Netlify):
1. Update `.env`:
```env
VITE_API_URL=https://your-backend.railway.app
```
2. Deploy

---

## 📧 Email Flow

1. **User submits form** → Frontend sends to backend
2. **Backend validates** → Checks all fields
3. **Sends 2 emails:**
   - ✅ Company email (info@aarcsolution.com) with form data
   - ✅ Client email with thank you message
4. **Returns success** → Frontend shows toast notification

---

## 💡 Tips

- Keep `.env` file secure (never commit to git)
- Test with real email first
- Monitor backend console for logs
- GoDaddy has no daily sending limits (unlike Gmail)

---

## 🆘 Need Help?

Check backend console logs - they show detailed error messages!

**Common Issues:**
- Wrong password → Check GoDaddy email settings
- Port blocked → Try port 587 instead of 465
- CORS error → Check FRONTEND_URL matches your frontend

---

**Ready?** Just add your credentials and start! 🚀
