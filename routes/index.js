import express from 'express';
import users from './users';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.json({ title: 'GyumriForAll' });
});

router.use('/users', users);

export default router;
