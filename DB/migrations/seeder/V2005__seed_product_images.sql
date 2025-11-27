-- Seed product images
INSERT INTO product_images (id, product_id, image_url, public_id, created_at, updated_at) VALUES
('aa512444-86fe-85ee-d39f-ad957a211e31', '671de000-42ba-41aa-9c5b-696136e77afd', 'https://res.cloudinary.com/dnva8natm/image/upload/v1764257736/products/iphone15pro_2.jpg', 'products/iphone15pro_2', NOW(), NOW()),
('bb623555-97ff-96ff-e4a0-be068b322f42', '671de000-42ba-41aa-9c5b-696136e77afd', 'https://res.cloudinary.com/dnva8natm/image/upload/v1764257736/products/iphone15pro_3.jpg', 'products/iphone15pro_3', NOW(), NOW()),
('cc734666-a800-a700-f5b1-cf179c433053', '782ef111-53cb-52bb-a06c-7a7247f88b0e', 'https://res.cloudinary.com/dnva8natm/image/upload/v1764257736/products/galaxys24_2.jpg', 'products/galaxys24_2', NOW(), NOW()),
('dd845777-b911-b811-06c2-d028ad544164', '893f0222-64dc-63cc-b17d-8b8358099c1f', 'https://res.cloudinary.com/dnva8natm/image/upload/v1764257736/products/nikeairmax_2.jpg', 'products/nikeairmax_2', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;