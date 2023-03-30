//This is the /db index.js
const {client} = require('pg')
require('dotenv').config()
const client = new Client('http://localhost3000')




//Users



//Pizza


//Toppings


client.query(`
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        address VARCHAR(255),
        phone INTEGER UNIQUE        
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
        "isCheckedOut" BOOLEAN DEFAULT FALSE,
        "totalCost" FLOAT 
    );
    CREATE TABLE orderItems(
        id SERIAL PRIMARY KEY,
        "productId" INTEGER REFERENCES products(id),
        "cartId" INTEGER REFERNCES carts(id), 
        "pizzaId" INTEGER REFERENCES pizza(id),
        cost FLOAT NOT NULL
    );
    CREATE TABLE pizza(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        "basePizzaCost" FLOAT NOT NULL,
        size INTEGER NOT NULL
    );
    CREATE TABLE toppings (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        price FLOAT NOT NULL
    );
    CREATE TABLE pizzaWithToppings (
        id SERIAL PRIMARY KEY,
        "pizzaID" REFERENCES pizza(id),
        "toppingsId" REFERENCES toppings(id),
        count INTEGER NOT NULL
    );
`)








module.exports = {}