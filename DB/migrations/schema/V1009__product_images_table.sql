-- Create product_images table
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    public_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on product_id for faster lookups
CREATE INDEX idx_product_images_product_id ON product_images(product_id);

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_product_images_updated_at 
    BEFORE UPDATE ON product_images 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();