// This is the Backend index.js

client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            address VARCHAR(255)        
        );
        CREATE TABLE products (
            id SERIAL PRIMARY KEY,
            category VARCHAR(255) NOT NULL,
            name VARCHAR(255) UNIQUE NOT NULL,
            price FLOAT NOT NULL 
        ); 
        CREATE TABLE carts (
            id SERIAL PRIMARY KEY,
            "userId" INTEGER REFERENCES users(id),
            "isCheckedOut" BOOLEAN DEFAULT FALSE
        );
        CREATE TABLE orderItems(
            id SERIAL PRIMARY KEY,
            "productId" INTEGER REFERENCES products(id),
            "cartId" INTEGER REFERNCES carts(id), 

        );
        CREATE TABLE pizza(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            "pizzaCost" FLOAT NOT NULL
        );
        CREATE TABLE toppings (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255),
            price FLOAT NOT NULL
        );
        CREATE TABLE pizzaWithToppings (
            id SERIAL PRIMARY KEY
            "pizzaID" REFERENCES pizza(id),
            "toppingsId" REFERENCES toppings(id),
            count INTEGER NOT NULL
        );
     `)