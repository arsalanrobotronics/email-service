import express from 'express';
import dotenv from 'dotenv';
import app from './src/app.js';
import { validateEmailConfig } from './src/config/email.config.js';
import { verifyEmailConfig } from './src/services/email.service.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  console.log('\n🚀 Starting AARC Solutions Email Engine...\n');
  
  if (!validateEmailConfig()) {
    console.error('⚠️  Server starting with incomplete email configuration.');
    console.error('⚠️  Email functionality will not work until .env is properly configured.\n');
  } else {
    console.log('✅ Email configuration validated');
    
    const isEmailReady = await verifyEmailConfig();
    if (!isEmailReady) {
      console.error('⚠️  Email connection test failed. Please check your credentials.\n');
    }
  }
  
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API: http://localhost:${PORT}`);
    console.log(`📧 Company Email: ${process.env.COMPANY_EMAIL || 'info@aarcsolution.com'}`);
    console.log(`\n💡 Ready to accept contact form submissions!\n`);
  });
};

startServer();
