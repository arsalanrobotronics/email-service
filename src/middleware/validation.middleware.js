import { body, validationResult } from 'express-validator';

export const validateContactForm = [
  body('fullName')
    /*.trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),*/
     .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .matches(/^[A-Za-z\s]{2,100}$/)
    .withMessage('Full name must contain only letters and be 2-100 characters'),
  body('email')
    /*.trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')*/
    //.normalizeEmail({
      //gmail_remove_dots: false
    //}),
       .trim()
    .notEmpty()
    .withMessage('Email is required')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)
    .withMessage('Invalid email format')
    .normalizeEmail({ gmail_remove_dots: false }),
  body('company')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company name must not exceed 100 characters'),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
    .withMessage('Please provide a valid phone number'),
  
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Please enter a valid subject')
    .isLength({ min: 2, max: 200 })
    .withMessage('Subject must be between 2 and 200 characters'),
  
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Please enter a valid message')
    .isLength({ min: 1, max: 2000 })
    .withMessage('Please enter a valid message'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    next();
  }
];
