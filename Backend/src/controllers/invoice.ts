import { Request, Response } from "express";
import { handleValidationErrors } from "../utils/validation";
import {
  createInvoice,
  getInvoiceById,
  getInvoicesByUser,
  getAllInvoices,
  updateInvoiceStatus,
  deleteInvoice,
} from "../services/invoice";

export const createInvoiceController = async (req: Request, res: Response) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const invoice = await createInvoice(req.body);
    return (res as any).success("Invoice created successfully", invoice, 201);
  } catch (error) {
    return (res as any).fail(
      "Failed to create invoice",
      "CREATE_INVOICE_ERROR",
      (error as any).message,
      500,
    );
  }
};

export const getInvoiceController = async (req: Request, res: Response) => {
  try {
    const invoiceId = req.params.id;
    const invoice = await getInvoiceById(invoiceId);
    return (res as any).success("Invoice retrieved successfully", invoice, 200);
  } catch (error) {
    return (res as any).fail(
      "Failed to get invoice",
      "GET_INVOICE_ERROR",
      (error as any).message,
      404,
    );
  }
};

export const getUserInvoicesController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const invoices = await getInvoicesByUser(userId);
    return (res as any).success("Invoices retrieved successfully", invoices, 200);
  } catch (error) {
    return (res as any).fail(
      "Failed to get user invoices",
      "GET_USER_INVOICES_ERROR",
      (error as any).message,
      500,
    );
  }
};

export const getAllInvoicesController = async (req: Request, res: Response) => {
  try {
    const invoices = await getAllInvoices();
    return (res as any).success("All invoices retrieved successfully", invoices, 200);
  } catch (error) {
    return (res as any).fail(
      "Failed to get all invoices",
      "GET_ALL_INVOICES_ERROR",
      (error as any).message,
      500,
    );
  }
};

export const updateInvoiceStatusController = async (req: Request, res: Response) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const invoiceId = req.params.id;
    const { status } = req.body;
    const invoice = await updateInvoiceStatus(invoiceId, status);
    return (res as any).success("Invoice status updated successfully", invoice, 200);
  } catch (error) {
    return (res as any).fail(
      "Failed to update invoice status",
      "UPDATE_INVOICE_STATUS_ERROR",
      (error as any).message,
      500,
    );
  }
};

export const deleteInvoiceController = async (req: Request, res: Response) => {
  try {
    const invoiceId = req.params.id;
    const result = await deleteInvoice(invoiceId);
    return (res as any).success("Invoice deleted successfully", result, 200);
  } catch (error) {
    return (res as any).fail(
      "Failed to delete invoice",
      "DELETE_INVOICE_ERROR",
      (error as any).message,
      500,
    );
  }
};