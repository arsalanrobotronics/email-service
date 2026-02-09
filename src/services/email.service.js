import nodemailer from 'nodemailer';
import { emailConfig, companyEmail } from '../config/email.config.js';
import path from 'path';
import { fileURLToPath } from 'url';

const transporter = nodemailer.createTransport(emailConfig);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendEmailToCompany = async (formData) => {
  const { fullName, email, company, phone, subject, message } = formData;

  // Log original email for debugging
  console.log('📧 Original client email:', email);

  const mailOptions = {
    from: emailConfig.auth.user,
    to: companyEmail,
    subject: `New Contact Form Submission: ${subject}`,
    text: `
New Contact Form Submission
============================

Full Name: ${fullName}
Email: ${email}
Company: ${company || 'Not provided'}
Phone: ${phone || 'Not provided'}
Subject: ${subject}

Message:
${message}

---
Received on: ${new Date().toLocaleString()}
From: AARC Solutions Website Contact Form
    `,
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .header { background: #0a3671; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #0a3671; }
    .value { background: #f5f5f5; padding: 8px; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="header">
    <h2>New Contact Form Submission</h2>
  </div>
  <div class="content">
    <div class="field">
      <div class="label">Full Name:</div>
      <div class="value">${fullName}</div>
    </div>
    <div class="field">
      <div class="label">Email:</div>
      <div class="value">${email}</div>
    </div>
    <div class="field">
      <div class="label">Company:</div>
      <div class="value">${company || 'Not provided'}</div>
    </div>
    <div class="field">
      <div class="label">Phone:</div>
      <div class="value">${phone || 'Not provided'}</div>
    </div>
    <div class="field">
      <div class="label">Subject:</div>
      <div class="value">${subject}</div>
    </div>
    <div class="field">
      <div class="label">Message:</div>
      <div class="value">${message.replace(/\n/g, '<br>')}</div>
    </div>
    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
      Received on: ${new Date().toLocaleString()}<br>
      From: AARC Solutions Website Contact Form
    </div>
  </div>
</body>
</html>
    `
  };

  return await transporter.sendMail(mailOptions);
};

export const sendThankYouEmail = async (formData) => {
  const { fullName, email } = formData;

  // Log original email for debugging
  console.log('📧 Sending thank-you email to:', email);

  const mailOptions = {
    from: emailConfig.auth.user,
    to: email,
    subject: 'Thank You - AARC Solutions',
    attachments: [
      {
        filename: 'aarc-logo.png',
        path: path.join(__dirname, '../assets/Untitled (300x).png'),
        cid: 'aarc-logo'
      }
    ],
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AARC Solutions | Thank You</title>
</head>
<body style="margin:0;padding:0;background:#eef2f7;font-family:'Segoe UI',Arial,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="width:560px;max-width:560px;background:#ffffff;border-radius:16px;border:1px solid #e2e8f0;box-shadow:0 12px 40px rgba(15,23,42,0.12);overflow:hidden;">
          <tr>
            <td style="padding:0;background:linear-gradient(135deg,#04102b 0%,#0a3671 60%,#0ab2ff 100%);">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:28px 32px;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td width="72" valign="middle" style="padding-right:16px;">
                          <img src="cid:aarc-logo" alt="AARC Solutions" width="72" style="display:block;border:0;max-width:72px;">
                        </td>
                        <td valign="middle">
                          <p style="margin:4px 0 0;font-size:24px;font-weight:700;color:#ffffff;">AARC Solutions</p>
                          <p style="margin:2px 0 0;font-size:14px;color:#c5e7ff;">The Rising Solutions</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 34px 24px;">
              <p style="margin:0 0 16px;font-size:18px;font-weight:600;color:#0f172a;">Hi ${fullName || 'there'},</p>
              <p style="margin:0 0 22px;font-size:15px;line-height:1.7;color:#475569;">
                Thanks for contacting us! Our consultants are already reviewing your message and will follow up with tailored next steps shortly.
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#eef8fe;border:1px solid rgba(10,178,255,0.3);border-radius:14px;padding:18px 22px;">
                <tr>
                  <td style="font-size:13px;font-weight:700;color:#0a3671;letter-spacing:0.08em;text-transform:uppercase;padding-bottom:12px;">What Happens Next</td>
                </tr>
                <tr>
                  <td style="font-size:14px;color:#0f172a;line-height:1.6;">
                    <div style="margin-bottom:8px;"><span style="color:#64748b;">Response window:</span> <strong style="color:#0f172a;">24–48 hours</strong></div>
                    <div style="margin-bottom:8px;"><span style="color:#64748b;">Contact method:</span> <strong style="color:#0f172a;">Email reply to: ${email}</strong></div>
                    <div><span style="color:#64748b;">Next steps:</span> <strong style="color:#0f172a;">Personalized consultation proposal</strong></div>
                  </td>
                </tr>
              </table>
              <p style="margin:28px 0 20px;font-size:15px;line-height:1.7;color:#475569;">
                If you need immediate assistance, please don't hesitate to reach out directly:
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;">
                <tr>
                  <td style="font-size:14px;color:#475569;line-height:1.6;">
                    <div style="margin-bottom:12px;"><strong style="color:#0f172a;">Email:</strong> <a href="mailto:info@aarcsolution.com" style="color:#0a3671;text-decoration:none;">info@aarcsolution.com</a></div>
                    <div style="margin-bottom:12px;"><strong style="color:#0f172a;">Phone:</strong> <a href="tel:+92343226765" style="color:#0a3671;text-decoration:none;">+92 343 226 765</a></div>
                    <div><strong style="color:#0f172a;">Website:</strong> <a href="https://aarcsolution.com" style="color:#0a3671;text-decoration:none;">aarcsolution.com</a></div>
                  </td>
                </tr>
              </table>
              <p style="margin:28px 0 0;font-size:14px;color:#64748b;text-align:center;">
                Best regards,<br>
                <strong style="color:#0f172a;">The AARC Solutions Team</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 34px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="font-size:12px;color:#64748b;text-align:center;line-height:1.6;">
                    <p style="margin:0 0 8px;">This email was sent to ${email} because you contacted AARC Solutions.</p>
                    <p style="margin:0;"> 2025 AARC Solutions. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Thank-you email sent successfully to:', email);
    return result;
  } catch (error) {
    console.error('❌ Failed to send thank-you email to:', email);
    console.error('❌ Error details:', error.message);
    throw error;
  }
};

export const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email service connected successfully');
    console.log(`📤 Emails will be sent from: ${emailConfig.auth.user}`);
    return true;
  } catch (error) {
    console.error('❌ Email service connection failed:', error.message);
    if (error.code === 'EAUTH') {
      console.error('   → Authentication failed. Check EMAIL_USER and EMAIL_PASSWORD');
    } else if (error.code === 'ECONNECTION') {
      console.error('   → Connection failed. Check EMAIL_HOST and EMAIL_PORT');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('   → Connection timeout. Check your internet connection');
    }
    return false;
  }
};
