const {client} = require("./client");

const {
    createUser,
    getUser,
    getUserById,
    getUserByUsername,
  } = require('./users.js');

async function dropTables() {
  try {
    console.log("Starting to drop tables...");
    await client.query(`
      DROP TABLE IF EXISTS "orderItems";
      DROP TABLE IF EXISTS "pizzaWithToppings";
      DROP TABLE IF EXISTS carts;
      DROP TABLE IF EXISTS toppings;
      DROP TABLE IF EXISTS pizza;
      DROP TABLE IF EXISTS products;
      DROP TABLE IF EXISTS users;
    `);
    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }
}
  
async function createTables() {
  try {
    console.log("Starting to build tables...");

    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        address VARCHAR(255),
        phone VARCHAR(255) UNIQUE
      );
      CREATE TABLE products (
          id SERIAL PRIMARY KEY,
          category VARCHAR(255) NOT NULL,
          name VARCHAR(255) UNIQUE NOT NULL,
          price FLOAT NOT NULL 
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
      CREATE TABLE carts (
          id SERIAL PRIMARY KEY,
          "userId" INTEGER REFERENCES users(id),
          "isCheckedOut" BOOLEAN DEFAULT FALSE,
          "totalCost" FLOAT 
      );
      CREATE TABLE "pizzaWithToppings" (
          id SERIAL PRIMARY KEY,
          "pizzaID" INTEGER REFERENCES pizza(id),
          "toppingsId" INTEGER REFERENCES toppings(id),
          count INTEGER NOT NULL
      );
      CREATE TABLE "orderItems"(
        id SERIAL PRIMARY KEY,
        "productId" INTEGER REFERENCES products(id),
        "cartId" INTEGER REFERENCES carts(id), 
        "pizzaId" INTEGER REFERENCES pizza(id),
        cost FLOAT NOT NULL
    );
    `);
    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error; 
  }
}

async function createInitialUsers() {
  console.log("Starting to create users...")
  try {
    const usersToCreate = [
      { username: "albert", password: "bertie99", email: "bertie@fake.com", phone: "110-111-0010", address: "someAddress 1111 s blvd" },
      { username: "sandra", password: "sandra123", email: "sandra@Superfake.com", phone: "110-000-0010", address: "someAddress 0000 s blvd" },
      { username: "glamgal", password: "glamgal123", email: "glammy@Ultrafake.com", phone: "110-333-0010", address: "someAddress 3333 s blvd" } 
    ]
    const users = await Promise.all(usersToCreate.map(createUser))

    console.log("Users created:")
    console.log(users)
    console.log("Finished creating users!")
  } catch (error) {
    console.error("Error creating users!")
    throw error
  }
}
async function rebuildDB() {
  try {
    client.connect();
    await dropTables();
    await createTables();
    await createInitialUsers();

    // await createInitialUsers()
    // await createInitialActivities()
    // await createInitialRoutines()
    // await createInitialRoutineActivities()
  } catch (error) {
    console.log("Error during rebuildDB")
    throw error
  }
}

rebuildDB()
  .catch(console.error)
  .finally(() => client.end());