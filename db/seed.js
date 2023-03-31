const {client} = require("./client");

const {
    createUser,
    getUser,
    getUserById,
    getUserByUsername,
  } = require('./users.js');
  const {
    createDessert,
    getAllDesserts,
    getDessertById,
    updateDesserts
  } = require('./desserts.js')
  const {
    createDrinks,
    getAllDrinks,
    getDrinksById,
    updateDrinks
  } = require('./drinks.js')
  const {
    createSides,
    getAllSides,
    getSidesById,
    updateSides
  } = require('./sides.js')

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

async function createInitialDesserts() {
  console.log("Starting to create desserts...")
  try {
    const dessertsToCreate = [
      { category: "desserts", name: "Brownies",  price: 7.99 },
      { category: "desserts", name: "Cinnamon Twists",  price: 7.99 },
      { category: "desserts", name: "Apple Pie", price: 11.99 },
      { category: "desserts", name: "Chocolate Ice Cream", price: 4.99 },
    ]
    const desserts = await Promise.all(dessertsToCreate.map(createDessert))

    console.log(desserts)
    console.log("Finished creating desserts")
  } catch(error) {
  console.log(error)
}
}

async function createInitialDrinks() {
  console.log("Starting to create drinks...")
  try {
    const drinksToCreate = [
      { category: "drinks", name: "Small Neuron Fizz", price: 2.79  },
      { category: "drinks", name: "Large Neuron Fizz", price: 3.29  },
      { category: "drinks", name: "Small Nexus Nectar", price: 2.79  },
      { category: "drinks", name: "Large Nexus Nectar", price: 3.29 },
      { category: "drinks", name: "Small Circuit Surge", price: 2.79  },
      { category: "drinks", name: "Large Circuit Surge", price: 3.29  },
      { category: "drinks", name: "Small Binary Burst", price: 2.79 },
      { category: "drinks", name: "Large Binary Burst", price: 3.29  },
      { category: "drinks", name: "Small Quantum Cola", price: 2.79  },
      { category: "drinks", name: "Large Quantum Cola", price: 3.29  },
      { category: "drinks", name: "Small Plasma Pop", price: 2.79  },
      { category: "drinks", name: "Large Plasma Pop", price: 3.29  }
    ]
    const drinks = await Promise.all(drinksToCreate.map(createDrinks))

    console.log(drinks)
    console.log("Finished Creating Drinks")
  } catch(error) {
    console.log(error)
  }
}
async function createInitialSides() {
  console.log("Starting to create sides...")
  try {
    const sidesToCreate = [
      { category: "sides", name: "Salad", price: 6.99},
      { category: "sides", name: "4ct Breadsticks", price: 4.99},
      { category: "sides", name: "6ct Breadsticks", price: 6.99},
      { category: "sides", name: "8ct Wings", price: 11.99},
      { category: "sides", name: "12ct Wings", price: 13.99},
      { category: "sides", name: "Marinara Cup", price: .99},
      { category: "sides", name: "Icing Cup", price: 1.99}
      

    ]
    const sides = await Promise.all(sidesToCreate.map(createSides))

    console.log(sides)
    console.log("Finished Creating Sides")

  } catch(error) {
    console.log(error)
  }
}

async function rebuildDB() {
  try {
    client.connect();
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialDesserts();
    await createInitialDrinks();
    await createInitialSides();

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