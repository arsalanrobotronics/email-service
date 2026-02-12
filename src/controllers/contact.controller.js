import { sendEmailToCompany, sendThankYouEmail } from '../services/email.service.js';
import { emailQueue } from '../utils/emailQueue.js';
import { validateContactInput, sanitize, countLinks, verifyCaptcha } from '../utils/validation.js';
import { LRUCache } from 'lru-cache';
import dns from 'dns/promises';

// ─── In-memory abuse protection (LRU caches) ───
const ipCache = new LRUCache({ max: 500, ttl: 10 * 60 * 1000 });       // IP → count
const emailCache = new LRUCache({ max: 500, ttl: 10 * 60 * 1000 });    // email → count
const messageCache = new LRUCache({ max: 500, ttl: 10 * 60 * 1000 });  // hash → true

const IP_LIMIT = 3;        // Same IP: max 3 emails per 10 min
const EMAIL_LIMIT = 2;     // Same email: max 2 messages per 10 min
const MAX_LINKS = 3;       // Max links in message

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return String(hash);
}

const verifyEmailDomain = async (email) => {
  const [, domain] = email.split('@');
  if (!domain) return false;
  try {
    const mxRecords = await dns.resolveMx(domain);
    return Array.isArray(mxRecords) && mxRecords.length > 0;
  } catch {
    return false;
  }
};

export const handleContactForm = async (req, res) => {
  try {
    // ─── Captcha check ───
    const { captchaToken } = req.body;
    const captchaValid = await verifyCaptcha(captchaToken);
    if (!captchaValid) {
      return res.status(403).json({
        success: false,
        message: 'Captcha verification failed. Please try again.'
      });
    }

    // ─── Input validation ───
    const validationErrors = validateContactInput(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // ─── IP-based abuse check ───
    const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ipCount = ipCache.get(clientIp) || 0;
    if (ipCount >= IP_LIMIT) {
      return res.status(429).json({
        success: false,
        message: 'Too many emails sent. Please try again later.'
      });
    }

    // ─── Email-based abuse check ───
    const emailKey = req.body.email.toLowerCase().trim();
    const emailCount = emailCache.get(emailKey) || 0;
    if (emailCount >= EMAIL_LIMIT) {
      return res.status(429).json({
        success: false,
        message: 'Too many emails sent. Please try again later.'
      });
    }

    // ─── Link count check ───
    if (countLinks(req.body.message) > MAX_LINKS) {
      return res.status(400).json({
        success: false,
        message: 'Message contains too many links.'
      });
    }

    // ─── Duplicate message check ───
    const msgHash = simpleHash(emailKey + ':' + req.body.message.trim().toLowerCase());
    if (messageCache.has(msgHash)) {
      return res.status(429).json({
        success: false,
        message: 'Duplicate message detected. Please wait before sending again.'
      });
    }

    // ─── Build sanitized form data ───
    const originalEmail = req.body.email;
    const formData = {
      fullName: sanitize(req.body.fullName),
      email: req.body.email,
      originalEmail: originalEmail,
      company: sanitize(req.body.company || ''),
      phone: sanitize(req.body.phone || ''),
      subject: sanitize(req.body.subject),
      message: sanitize(req.body.message)
    };

    // ─── MX domain verification ───
    const emailExists = await verifyEmailDomain(formData.email);
    if (!emailExists) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address. Please enter a valid email address.'
      });
    }

    // ─── Update abuse counters immediately (before sending) ───
    ipCache.set(clientIp, ipCount + 1);
    emailCache.set(emailKey, emailCount + 1);
    messageCache.set(msgHash, true);

    // ─── Respond to frontend FIRST (fast response) ───
    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.'
    });

    // ─── Send emails in background (fire and forget) ───
    emailQueue.enqueue(() => sendEmailToCompany(formData))
      .then(() => console.log('✅ Email sent to company'))
      .catch((err) => console.error('❌ Failed to send company email:', err.message));

    emailQueue.enqueue(() => sendThankYouEmail(formData))
      .then(() => console.log('✅ Thank you email sent to client'))
      .catch((err) => console.error('❌ Failed to send thank you email:', err.message));

  } catch (error) {
    console.error('❌ Error sending emails:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email. Please try again later or contact us directly.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
