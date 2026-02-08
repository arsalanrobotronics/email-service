# AARC Solutions - Email Engine Backend

Backend service for handling contact form submissions and email notifications.

## Features

- Send form data to company email (info@aarcsolution.com)
- Send thank you email to client
- Input validation
- CORS enabled
- Environment-based configuration

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Configure your email credentials in `.env`:
   - For Gmail: Enable 2FA and create an App Password
   - Update EMAIL_USER and EMAIL_PASSWORD

4. Run development server:
```bash
npm run dev
```

5. Run production server:
```bash
npm start
```

## API Endpoints

### POST /api/contact
Send contact form data

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "company": "ABC Corp",
  "phone": "+1234567890",
  "subject": "Inquiry",
  "message": "Hello, I'm interested in your services"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

## Deployment

- Deploy to Railway, Render, or any Node.js hosting
- Set environment variables in hosting platform
- Update FRONTEND_URL to your production frontend URL
