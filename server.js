import express from 'express';
import dotenv from 'dotenv';
import app from './src/app.js';
import { validateEmailConfig } from './src/config/email.config.js';
import { verifyEmailConfig } from './src/services/email.service.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const withTimeout = (promise, timeoutMs, timeoutMessage) => {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
};

const startServer = async () => {
  console.log('\n🚀 Starting AARC Solutions Email Engine...\n');
  
  const emailConfigValid = validateEmailConfig();
  if (!emailConfigValid) {
    console.error('⚠️  Server starting with incomplete email configuration.');
    console.error('⚠️  Email functionality will not work until .env is properly configured.\n');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API listening on port ${PORT}`);
    if (process.env.RAILWAY_PUBLIC_DOMAIN) {
      console.log(`🔗 Public API: https://${process.env.RAILWAY_PUBLIC_DOMAIN}`);
    }
    console.log(`📧 Company Email: ${process.env.COMPANY_EMAIL || 'info@aarcsolution.com'}`);
    console.log(`\n💡 Ready to accept contact form submissions!\n`);
  });

  if (emailConfigValid) {
    console.log('✅ Email configuration validated');

    withTimeout(
      verifyEmailConfig(),
      15000,
      'Email service connection timed out'
    ).then((isEmailReady) => {
      if (!isEmailReady) {
        console.error('⚠️  Email connection test failed. Please check your credentials.\n');
      }
    }).catch((error) => {
      console.error('⚠️  Email connection test failed:', error.message);
    });
  }
};

startServer();
