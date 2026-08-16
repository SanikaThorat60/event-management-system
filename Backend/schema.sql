-- 1. Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS event_management;
USE event_management;

-- 2. Create the users table (used by userController.js)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user', -- Added role column (can also be ENUM('user', 'manager'))
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 3. Create the events table (used by eventController.js)
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    date VARCHAR(50) NOT NULL,
    time VARCHAR(50) NOT NULL,
    venue VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create the bookings table (used by bookingController.js)
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    event_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- 5. Create the payments table (used by paymentController.js)
CREATE TABLE IF NOT EXISTS payments(
    id INT PRIMARY KEY AUTO_INCREMENT,
    payment_id VARCHAR(255),
    order_id VARCHAR(255),
    status VARCHAR(50),
    event_id INT DEFAULT NULL,
    amount INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);
