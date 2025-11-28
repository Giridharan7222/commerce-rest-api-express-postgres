import express from "express";
import router from ".";
import helmet from "helmet";
import cors from "cors";
import { corsOptionsDelegate } from "./middleware/cors";
import { log } from "./middleware/logger";
import { limiter } from "./middleware/limiter";
import { errorHandler404 } from "./middleware/errorHandler404";
import { errorHandler } from "./middleware/errorHandler";
import { responseHandler } from "./middleware/responseHandler";
import { apiLogger } from "./middleware/apiLogger";
import { setupSwagger } from "./swagger";

const app = express();

// Global middlewares
app.use(cors(corsOptionsDelegate));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to handle form-urlencoded data
app.use(responseHandler as express.RequestHandler);
app.use(apiLogger);
app.use(log);
app.use(helmet());
app.use(limiter);

// Swagger documentation
setupSwagger(app);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Main router
app.use(router);

// 404 handler (for unmatched routes)
app.use(errorHandler404);

// error handler
app.use(errorHandler);

export default app;
