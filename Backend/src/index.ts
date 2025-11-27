import express from 'express';
import { userRoutes } from './routes/user';
import uploadRoutes from './t1';


const router = express.Router();

router.use('/api', userRoutes);
router.use("/api", uploadRoutes);

export default router;
