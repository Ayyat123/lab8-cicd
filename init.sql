-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending'
);

-- Insert sample tasks
INSERT INTO tasks (name, status) VALUES
    ('Buy groceries', 'pending'),
    ('Finish homework', 'in-progress'),
    ('Call plumber', 'pending'),
    ('Read book', 'completed'),
    ('Exercise', 'pending'),
    ('Write report', 'in-progress');