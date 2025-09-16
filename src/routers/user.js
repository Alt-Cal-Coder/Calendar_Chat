import { Router } from 'express';
import { changeNotificationPrefences, getUserById } from '../controller/user.js';

let router = Router();

router.get("/:id", getUserById);
router.put("/:id/notification-preference", changeNotificationPrefences);

export default router;
