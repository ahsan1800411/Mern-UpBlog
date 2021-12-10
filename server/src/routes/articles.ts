import express from 'express';
import User from '../models/User';
import Article from '../models/Article';

import { checkAuth } from '../middlewares/checkAuth';
import { stripe } from './../utils/stripe';

const router = express.Router();

router.get('/', checkAuth, async (req, res) => {
  const user = await User.findOne({ email: req.user });

  const subscriptions = await stripe.subscriptions.list(
    {
      customer: user.customerStripeId,
      expand: ['data.default_payment_method'],
      status: 'all',
    },
    {
      apiKey: process.env.STRIPE_SECRET_KEY,
    }
  );
  if (!subscriptions.data.length) return res.json([]);
  // @ts-ignore
  const plan = subscriptions.data[0].plan.nickname;

  //   Give user the articles according to their plans
  if (plan === 'Basic') {
    const articles = await Article.find({ access: 'Basic' });
    return res.json(articles);
  } else if (plan === 'Standard') {
    const articles = await Article.find({
      access: { $in: ['Basic', 'Standard'] },
    });
    return res.json(articles);
  } else {
    const articles = await Article.find({});
    return res.json(articles);
  }
});

export default router;
