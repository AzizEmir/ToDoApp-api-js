import { Router } from 'express';
import { register, login } from '../controllers/userController';

const router = Router();

// Kullanıcı kayıt
router.post('/register', register);

// Kullanıcı girişi
router.post('/login', login);

export default router;
