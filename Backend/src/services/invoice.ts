import Invoice, { InvoiceStatus } from "../models/invoice";
import InvoiceLineItem from "../models/invoiceLineItem";
import Order from "../models/order";
import User from "../models/users";
import Product from "../models/product";

interface CreateInvoiceDto {
  orderId: string;
  userId: string;
  subTotal: number;
  taxAmount?: number;
  discountAmount?: number;
  totalAmount: number;
  currency?: string;
  lineItems: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    totalPrice: number;
    taxRate?: number;
    taxAmount?: number;
  }[];
}

export async function createInvoice(dto: CreateInvoiceDto) {
  const order = await Order.findByPk(dto.orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  const user = await User.findByPk(dto.userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Generate invoice number
  const invoiceCount = await Invoice.count();
  const invoiceNumber = `INV-${Date.now()}-${String(invoiceCount + 1).padStart(4, '0')}`;

  const invoice = await Invoice.create({
    invoice_number: invoiceNumber,
    order_id: dto.orderId,
    user_id: dto.userId,
    sub_total: dto.subTotal,
    tax_amount: dto.taxAmount || 0,
    discount_amount: dto.discountAmount || 0,
    total_amount: dto.totalAmount,
    currency: dto.currency || 'INR',
    status: InvoiceStatus.GENERATED,
    issued_at: new Date(),
  } as any);

  // Create line items
  const lineItemPromises = dto.lineItems.map((item) =>
    InvoiceLineItem.create({
      invoice_id: invoice.id,
      product_id: item.productId,
      product_name: item.productName,
      quantity: item.quantity,
      price: item.price,
      total_price: item.totalPrice,
      tax_rate: item.taxRate || 0,
      tax_amount: item.taxAmount || 0,
    } as any)
  );

  await Promise.all(lineItemPromises);

  return getInvoiceById(invoice.id);
}

export async function getInvoiceById(invoiceId: string) {
  const invoice = await Invoice.findByPk(invoiceId, {
    include: [
      { model: User, as: "user" },
      { model: Order, as: "order" },
      { 
        model: InvoiceLineItem, 
        as: "lineItems",
        include: [{ model: Product, as: "productInfo" }]
      },
    ],
  });

  if (!invoice) {
    throw new Error("Invoice not found");
  }

  return invoice.get({ plain: true });
}

export async function getInvoicesByUser(userId: string) {
  const invoices = await Invoice.findAll({
    where: { user_id: userId },
    include: [
      { model: Order, as: "order" },
      { model: InvoiceLineItem, as: "lineItems" },
    ],
    order: [["created_at", "DESC"]],
  });

  return invoices.map((invoice: any) => invoice.get({ plain: true }));
}

export async function getAllInvoices() {
  const invoices = await Invoice.findAll({
    include: [
      { model: User, as: "user" },
      { model: Order, as: "order" },
      { model: InvoiceLineItem, as: "lineItems" },
    ],
    order: [["created_at", "DESC"]],
  });

  return invoices.map((invoice: any) => invoice.get({ plain: true }));
}

export async function updateInvoiceStatus(invoiceId: string, status: InvoiceStatus) {
  const invoice = await Invoice.findByPk(invoiceId);

  if (!invoice) {
    throw new Error("Invoice not found");
  }

  const updateData: any = { status };
  if (status === InvoiceStatus.PAID) {
    updateData.paid_at = new Date();
  }

  await invoice.update(updateData);
  return invoice.get({ plain: true });
}

export async function deleteInvoice(invoiceId: string) {
  const invoice = await Invoice.findByPk(invoiceId);

  if (!invoice) {
    throw new Error("Invoice not found");
  }

  await invoice.destroy();
  return { message: "Invoice deleted successfully" };
}