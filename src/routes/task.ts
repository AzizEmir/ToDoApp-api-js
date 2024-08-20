import express from 'express';
import { getAllTasks, createTask, deleteTasks } from '../controllers/taskController';
import { authMiddleware } from '../middleware/auth'; // authMiddleware'i içe aktarın

const router = express.Router();

// Tüm görevleri getir (token doğrulaması gerektirir)
router.get('/', authMiddleware, getAllTasks);

// Yeni görev oluştur (token doğrulaması gerektirir)
router.post('/', authMiddleware, createTask);

// Görevi sil (token doğrulaması gerektirir)
router.delete('/', authMiddleware, deleteTasks);

export default router;