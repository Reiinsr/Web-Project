-- Create database
CREATE DATABASE IF NOT EXISTS event_management;
USE event_management;

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample events
INSERT INTO events (title, date, description, location) VALUES
('Tech Conference 2023', '2025-11-15', 'Join us for the annual Tech Conference featuring industry leaders and cutting-edge technology demonstrations.', 'Convention Center'),
('Music Festival', '2025-12-01', 'Experience live music from top artists in an unforgettable outdoor setting.', 'City Park'),
('Startup Pitch Night', '2026-04-15', 'Watch startups pitch their ideas to top investors and industry experts.', 'Innovation Hub'),
('Art & Design Expo', '2026-05-20', 'Explore the latest trends in art and design from renowned artists and designers.', 'Art Gallery');

