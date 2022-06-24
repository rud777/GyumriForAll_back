import express from 'express';
import UsersController from '../controllers/UsersController';

const router = express.Router();

router.post('/register', UsersController.register);
router.post('/login', UsersController.login);
router.get('/account/me', UsersController.accountMe);
router.get('/list', UsersController.list);
router.get('/account/:id', UsersController.account);
router.put('/update', UsersController.update);
router.delete('/delete/:id', UsersController.delete);

export default router;
