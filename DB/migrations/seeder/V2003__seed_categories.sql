-- Seed categories
INSERT INTO categories (id, name, description, created_at, updated_at) VALUES
('1d097097-daab-4502-a166-e0da36bb3667', 'Electronics', 'Electronic devices and gadgets', NOW(), NOW()),
('2e208208-ebbc-5613-b277-f1eb47cc4778', 'Clothing', 'Fashion and apparel', NOW(), NOW()),
('3f319319-fccf-6724-c388-02fc58dd5889', 'Books', 'Books and educational materials', NOW(), NOW()),
('4a420420-0dd0-7835-d499-13fd69ee699a', 'Home & Garden', 'Home improvement and gardening supplies', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;