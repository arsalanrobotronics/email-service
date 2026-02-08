import dotenv from 'dotenv';

dotenv.config();

export const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtpout.secureserver.net',
  port: parseInt(process.env.EMAIL_PORT || '465'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000
};

export const companyEmail = process.env.COMPANY_EMAIL || 'info@aarcsolution.com';

export const validateEmailConfig = () => {
  const errors = [];
  
  if (!process.env.EMAIL_USER) {
    errors.push('EMAIL_USER is not set in .env file');
  }
  
  if (!process.env.EMAIL_PASSWORD) {
    errors.push('EMAIL_PASSWORD is not set in .env file');
  }
  
  if (!process.env.EMAIL_HOST) {
    errors.push('EMAIL_HOST is not set in .env file');
  }
  
  if (errors.length > 0) {
    console.error('❌ Email Configuration Errors:');
    errors.forEach(error => console.error(`   - ${error}`));
    console.error('\n💡 Please check your .env file and add missing credentials.\n');
    return false;
  }
  
  return true;
};
