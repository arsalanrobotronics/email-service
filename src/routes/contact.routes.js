import express from 'express';
import { handleContactForm } from '../controllers/contact.controller.js';
import { validateContactForm } from '../middleware/validation.middleware.js';

const router = express.Router();

router.post('/', validateContactForm, handleContactForm);

export default router;
