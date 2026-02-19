import validator from 'validator';

export const sanitize = (value) => {
 // if (!value) return '';
 /* let clean = validator.trim(value);
  clean = validator.escape(clean);
  clean = validator.stripLow(clean, { keep_newlines: true });
  return clean;*/
  if (!value) return '';

  let clean = validator.trim(value);

  // Remove HTML tags
  clean = clean.replace(/<\/?[^>]+(>|$)/g, '');

  // Keep ONLY letters, numbers, and spaces
  clean = clean.replace(/[^a-zA-Z0-9\s]/g, '');

  // Normalize spaces
  clean = clean.replace(/\s+/g, ' ').trim();

  return clean;
};

export const validateContactInput = (body) => {
  const errors = [];

  // Name
  if (!body.fullName || !validator.isLength(body.fullName.trim(), { min: 2, max: 100 })) {
    errors.push({ field: 'fullName', message: 'Full name must be between 2 and 100 characters' });
  }

  // Email
  if (!body.email || !validator.isEmail(body.email)) {
    errors.push({ field: 'email', message: 'Please provide a valid email address' });
  }

  // Subject
  if (!body.subject || !validator.isLength(body.subject.trim(), { min: 2, max: 200 })) {
    errors.push({ field: 'subject', message: 'Subject must be between 2 and 200 characters' });
  }

  // Message
  if (!body.message || !validator.isLength(body.message.trim(), { min: 1, max: 1000 })) {
    errors.push({ field: 'message', message: 'Message must be between 1 and 1000 characters' });
  }

  // Company (optional)
  if (body.company && !validator.isLength(body.company.trim(), { max: 100 })) {
    errors.push({ field: 'company', message: 'Company name must not exceed 100 characters' });
  }

  // Phone (optional)
  if (body.phone && body.phone.trim().length > 0) {
    const cleaned = body.phone.replace(/[\s\-()]/g, '');
    if (!validator.isMobilePhone(cleaned, 'any', { strictMode: false })) {
      errors.push({ field: 'phone', message: 'Please provide a valid phone number' });
    }
  }

  return errors;
};

// Count links in message
export const countLinks = (text) => {
  const urlPattern = /https?:\/\/[^\s]+/gi;
  const matches = text.match(urlPattern);
  return matches ? matches.length : 0;
};

// Captcha verification stub — connect Cloudflare Turnstile or reCAPTCHA later
export const verifyCaptcha = async (token) => {
  // TODO: Replace with actual verification
  //
  // Cloudflare Turnstile example:
  //   const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ secret: process.env.TURNSTILE_SECRET, response: token })
  //   });
  //   const data = await response.json();
  //   return data.success;
  //
  // reCAPTCHA example:
  //   const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token}`);
  //   const data = await response.json();
  //   return data.success;

  if (!token) return false;
  return true;
};
