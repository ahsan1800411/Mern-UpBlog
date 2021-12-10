import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { checkAuth } from '../middlewares/checkAuth';
import { stripe } from '../utils/stripe';
const router = express.Router();

// sign up

router.post(
  '/signup',
  body('email').isEmail().withMessage('The Email is Invalid'),
  body('password')
    .isLength({ min: 5 })
    .withMessage('The password is too short'),
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      const errors = validationErrors.array().map((error) => {
        return {
          msg: error.msg,
        };
      });
      return res.status(400).json({ errors, data: null });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res.json({
        errors: [
          {
            msg: 'The email is already Existed',
          },
        ],
        data: null,
      });
    }

    const customer = await stripe.customers.create(
      { email },
      {
        apiKey: process.env.STRIPE_SECRET_KEY,
      }
    );

    const newUser = await User.create({
      email,
      password,
      customerStripeId: customer.id,
    });

    const token = jwt.sign(
      { email: newUser.email },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: 360000,
      }
    );

    res.status(200).json({
      errors: [],
      data: {
        token,
        user: {
          id: newUser._id,
          email: newUser.email,
          customerStripeId: customer.id,
        },
      },
    });
  }
);

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({
      errors: [
        {
          msg: 'Invalid Credentials',
        },
      ],
      data: null,
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.json({
      errors: [
        {
          msg: 'Invalid Credentials',
        },
      ],
      data: null,
    });
  }

  const token = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET_KEY as string,
    {
      expiresIn: 360000,
    }
  );

  res.status(200).json({
    errors: [],
    data: { token, user: { id: user._id, email: user.email } },
  });
});

router.get('/me', checkAuth, async (req, res) => {
  const user = await User.findOne({ email: req.user });

  return res.json({
    errors: [],
    data: {
      user: {
        id: user._id,
        email: user.email,
        customerStripeId: user.customerStripeId,
      },
    },
  });
});

export default router;
