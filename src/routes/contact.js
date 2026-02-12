import express from 'express';
import { handleContactForm } from '../controllers/contact.controller.js';
import { contactLimiter, contactSlowDown, botProtection } from '../middleware/security.js';

const router = express.Router();

router.post(
  '/contact',
  contactLimiter,
  contactSlowDown,
  botProtection,
  handleContactForm
);

export default router;
