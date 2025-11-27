-- Update transaction_status enum for Stripe
ALTER TYPE transaction_status ADD VALUE 'requires_action';
ALTER TYPE transaction_status ADD VALUE 'processing';
ALTER TYPE transaction_status ADD VALUE 'succeeded';

-- Add Stripe-specific columns to payment_transactions
ALTER TABLE payment_transactions 
ADD COLUMN payment_intent_id VARCHAR(255),
ADD COLUMN charge_id VARCHAR(255),
ADD COLUMN stripe_customer_id VARCHAR(255),
ADD COLUMN stripe_payment_method_id VARCHAR(255),
ADD COLUMN initiated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN processed_at TIMESTAMP;

-- Update existing columns
ALTER TABLE payment_transactions 
ALTER COLUMN transaction_reference DROP NOT NULL;

-- Add Stripe-specific indexes
CREATE INDEX idx_payment_transactions_payment_intent_id ON payment_transactions(payment_intent_id);
CREATE INDEX idx_payment_transactions_charge_id ON payment_transactions(charge_id);
CREATE INDEX idx_payment_transactions_stripe_customer_id ON payment_transactions(stripe_customer_id);