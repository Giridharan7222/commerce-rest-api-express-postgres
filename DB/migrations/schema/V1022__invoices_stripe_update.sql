-- Add Stripe invoice ID to invoices table
ALTER TABLE invoices 
ADD COLUMN stripe_invoice_id VARCHAR(255);

-- Create index for Stripe invoice ID
CREATE INDEX idx_invoices_stripe_invoice_id ON invoices(stripe_invoice_id);