import { sendEmailToCompany, sendThankYouEmail } from '../services/email.service.js';
import dns from 'dns/promises';
const ipRequestMap = new Map();
const BLOCK_TIME = 60 * 1000;

function sanitizeInput(value) {
  if (!value) return '';
  
  // ✅ Replace all non-alphanumeric characters (except space) with a blank space
  return value.replace(/[^a-zA-Z0-9\s]/g, ' ');
}

 

const verifyEmailDomain = async (email) => {
  const [, domain] = email.split('@');
  if (!domain) return false;

  try {
    const mxRecords = await dns.resolveMx(domain);
    return Array.isArray(mxRecords) && mxRecords.length > 0;
  } catch (error) {
    console.warn(`⚠️  Unable to verify MX records for ${domain}:`, error.message);
    return false;
  }
};

export const handleContactForm = async (req, res) => {
  try {
    // IP-based check
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (ipRequestMap.has(clientIp)) {
      return res.status(429).json({
        success: false,
        message: 'You have already submitted the form. Please wait before trying again.'
      });
    }

    ipRequestMap.set(clientIp, Date.now());
    setTimeout(() => ipRequestMap.delete(clientIp), BLOCK_TIME);
    // Store original email before any processing
    const originalEmail = req.body.email;
const formData = {
  fullName: sanitizeInput(req.body.fullName),
  email: req.body.email, // email validated separately
  originalEmail: req.body.email, // original email preserved
  company: sanitizeInput(req.body.company || ''),
  phone: sanitizeInput(req.body.phone || ''),
  subject: sanitizeInput(req.body.subject),
  message: sanitizeInput(req.body.message)
};

console.log('📨 Sanitized formData:', formData);
    /*const formData = {
      fullName: req.body.fullName,
      email: req.body.email,
      originalEmail: originalEmail, // Add original email to formData 
      company: req.body.company || '',
      phone: req.body.phone || '',
      subject: req.body.subject,
      message: req.body.message
    };

    console.log('📨 Processing contact form submission from:', formData.email);*/
    console.log('📧 Original email format:', originalEmail);

    const emailExists = await verifyEmailDomain(formData.email);
    if (!emailExists) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address. Please enter a valid email address.'
      });
    }

    await sendEmailToCompany(formData);
    console.log('✅ Email sent to company');

    try {
      await sendThankYouEmail(formData);
      console.log('✅ Thank you email sent to client');
    } catch (emailError) {
      console.error('❌ Failed to send thank you email:', emailError.message);
    }

    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.'
    });

  } catch (error) {
    console.error('❌ Error sending emails:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to send email. Please try again later or contact us directly.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
