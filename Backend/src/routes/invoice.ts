import { Router } from "express";
import {
  createInvoiceController,
  getInvoiceController,
  getUserInvoicesController,
  getAllInvoicesController,
  updateInvoiceStatusController,
  deleteInvoiceController,
} from "../controllers/invoice";
import { authenticateToken, requireRole } from "../middleware/auth";
import { UserRole } from "../enums/user";
import { body } from "express-validator";

const router = Router();

// Validation middleware
const createInvoiceValidation = [
  body("orderId").isUUID().withMessage("Valid order ID is required"),
  body("userId").isUUID().withMessage("Valid user ID is required"),
  body("subTotal").isNumeric().withMessage("Sub total must be a number"),
  body("totalAmount").isNumeric().withMessage("Total amount must be a number"),
  body("lineItems").isArray().withMessage("Line items must be an array"),
  body("lineItems.*.productId").isUUID().withMessage("Valid product ID is required"),
  body("lineItems.*.productName").notEmpty().withMessage("Product name is required"),
  body("lineItems.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  body("lineItems.*.price").isNumeric().withMessage("Price must be a number"),
  body("lineItems.*.totalPrice").isNumeric().withMessage("Total price must be a number"),
];

const updateInvoiceStatusValidation = [
  body("status").isIn(["generated", "paid", "cancelled"]).withMessage("Invalid status"),
];

// Routes
router.post(
  "/invoices",
  authenticateToken,
  requireRole([UserRole.ADMIN]),
  createInvoiceValidation,
  createInvoiceController,
);

router.get(
  "/invoices/my",
  authenticateToken,
  getUserInvoicesController,
);

router.get(
  "/invoices",
  authenticateToken,
  requireRole([UserRole.ADMIN]),
  getAllInvoicesController,
);

router.get(
  "/invoices/:id",
  authenticateToken,
  getInvoiceController,
);

router.patch(
  "/invoices/:id/status",
  authenticateToken,
  requireRole([UserRole.ADMIN]),
  updateInvoiceStatusValidation,
  updateInvoiceStatusController,
);

router.delete(
  "/invoices/:id",
  authenticateToken,
  requireRole([UserRole.ADMIN]),
  deleteInvoiceController,
);

export default router;