import { Router } from "express";
import {
  getSystemHealthController,
  createSystemHealthController,
} from "../controllers/systemHealth";
import { authenticateToken, requireRole } from "../middleware/auth";
import { UserRole } from "../enums/user";

const router = Router();

router.get(
  "/",
  authenticateToken,
  requireRole([UserRole.ADMIN]),
  getSystemHealthController,
);
router.post(
  "/",
  authenticateToken,
  requireRole([UserRole.ADMIN]),
  createSystemHealthController,
);

export default router;
