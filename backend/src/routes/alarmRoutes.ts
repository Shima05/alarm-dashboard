import { Router } from 'express';
import { AlarmController } from '../controllers/alarmController.ts';
import { authMiddleware } from '../middlewares/authMiddleware.ts';
import { validateInputs } from '../middlewares/validateInputsMiddleware.ts';

const router = Router();

router.post('/', authMiddleware, validateInputs, AlarmController.createAlarm);
router.get('/', authMiddleware, validateInputs, AlarmController.getListAlarms);
router.get('/:id', authMiddleware, validateInputs, AlarmController.getAlarmById);
router.post('/:id/visualizations', authMiddleware, AlarmController.uploadVisualizations);

export { router as alarmRoutes };
