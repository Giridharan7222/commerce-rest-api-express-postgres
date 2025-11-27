export enum TransactionStatus {
  INITIATED = "initiated",
  PENDING = "pending",
  REQUIRES_ACTION = "requires_action",
  PROCESSING = "processing",
  SUCCESSFUL = "successful",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export enum PaymentMethodType {
  UPI = "upi",
  COD = "cod",
  CREDIT_CARD = "credit_card",
  DEBIT_CARD = "debit_card",
  NET_BANKING = "net_banking",
  WALLET = "wallet",
}

export enum PaymentMethodBrand {
  VISA = "visa",
  MASTERCARD = "mastercard",
  AMEX = "amex",
  DISCOVER = "discover",
  PHONEPE = "phonepe",
  GPAY = "gpay",
  PAYTM = "paytm",
  OTHER = "other",
}

export enum RefundStatus {
  INITIATED = "initiated",
  PROCESSING = "processing",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

export enum InvoiceStatus {
  GENERATED = "generated",
  PAID = "paid",
  CANCELLED = "cancelled",
}
