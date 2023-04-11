const {client} = require("./client");

const {
    createUser,
    getUser,
    getUserById,
    getUserByUsername,
    createAdminUser,
    getAdminUser
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
  const {
    createToppings,
    getAllToppings,
    getToppingsById,
    updateToppings
  } = require('./toppings.js');
  const { 
    addToppingsToPizza,
    createPizza,
    addDetailsToPizza 
  } = require("./pizza");
  const {
    createCartWithoutUser,
    createCartForUser,
    checkoutCart,
    createOrderItemsRowForProduct,
    createOrderItemsRowForPizza
  } = require("./cart");
  const {
    createPaymentInformationForOrderRow
  } = require("./paymentInformationForOrder");

async function dropTables() {
  try {
    console.log("Starting to drop tables...");
    await client.query(`
      DROP TABLE IF EXISTS "paymentInformationForOrder";
      DROP TABLE IF EXISTS "orderItems";
      DROP TABLE IF EXISTS "pizzaWithToppings";
      DROP TABLE IF EXISTS carts;
      DROP TABLE IF EXISTS toppings;
      DROP TABLE IF EXISTS pizza;
      DROP TABLE IF EXISTS products;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS admin;
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
        name VARCHAR(255) NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        address VARCHAR(255),
        phone VARCHAR(255) UNIQUE
      );
      CREATE TABLE admin (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        "isAdmin" BOOLEAN DEFAULT TRUE
      );
      CREATE TABLE products (
          id SERIAL PRIMARY KEY,
          category VARCHAR(255) NOT NULL,
          name VARCHAR(255) UNIQUE NOT NULL,
          price FLOAT NOT NULL,
          "isActive" BOOLEAN DEFAULT true,
          image VARCHAR(255)
      ); 
      CREATE TABLE pizza(
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) UNIQUE,
          "basePizzaCost" FLOAT,
          size INTEGER
      );
      CREATE TABLE toppings (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) UNIQUE NOT NULL,
          price FLOAT NOT NULL,
          "isActive" BOOLEAN DEFAULT true,
          image VARCHAR(255)
      );
      CREATE TABLE carts (
          id SERIAL PRIMARY KEY,
          "userId" INTEGER REFERENCES users(id),
          "isCheckedOut" BOOLEAN DEFAULT FALSE,
          "totalCost" FLOAT,
          "deliveryAddress" VARCHAR(255) REFERENCES users(address),
          "orderLocation" VARCHAR(255) 
      );
      CREATE TABLE "pizzaWithToppings" (
          id SERIAL PRIMARY KEY,
          "pizzaId" INTEGER REFERENCES pizza(id),
          "toppingsId" INTEGER REFERENCES toppings(id),
          count INTEGER NOT NULL
      );
      CREATE TABLE "orderItems"(
        id SERIAL PRIMARY KEY,
        "productId" INTEGER REFERENCES products(id),
        "cartId" INTEGER REFERENCES carts(id), 
        "pizzaId" INTEGER REFERENCES pizza(id),
        count INTEGER NOT NULL,
        cost FLOAT NOT NULL,
        "productName" VARCHAR(255) REFERENCES products(name),
        "pizzaName" VARCHAR(255) REFERENCES pizza(name)
    );
      CREATE TABLE "paymentInformationForOrder"(
        id SERIAL PRIMARY KEY,
        "cartId" INTEGER UNIQUE REFERENCES carts(id), 
        "cardholderName" VARCHAR(255) NOT NULL,
        "cardNumber" VARCHAR(255) NOT NULL,
        "expirationDate" VARCHAR(255) NOT NULL,
        cvv VARCHAR(255) NOT NULL,
        "billingAddress" VARCHAR(255) NOT NULL
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
      { name: "albert", username: "albert", password: "bertie99", email: "bertie@fake.com", phone: "110-111-0010", address: "someAddress 1111 s blvd" },
      { name: "sandra", username: "sandra", password: "sandra123", email: "sandra@Superfake.com", phone: "110-000-0010", address: "someAddress 0000 s blvd" },
      { name: "jennifer", username: "glamgal", password: "glamgal123", email: "glammy@Ultrafake.com", phone: "110-333-0010", address: "someAddress 3333 s blvd" } 
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

async function createAdminUsers() {
  console.log("Starting to create admin users...")
  try {
    const adminToCreate = [
      { username: "charlie", password: "charlie123", isAdmin: true},
      { username: "tyler", password: "tyler123", isAdmin: true},
      { username: "emmanuel", password: "emmanuel123", isAdmin: true}
    ]
    const admin = await Promise.all(adminToCreate.map(createAdminUser))

    console.log("Admin created")
    console.log(admin)

  } catch(error) {
    console.error("Error creating admin users")
    throw error
  }
}

async function createInitialDesserts() {
  console.log("Starting to create desserts...")
  try {
    const dessertsToCreate = [
      { category: "desserts", name: "Brownies",  price: 7.99, image: "/Brownies.jpg", isActive: true },
      { category: "desserts", name: "Cinnamon Twists",  price: 7.99, image: "/Cinnamon.jpg", isActive: true  },
      { category: "desserts", name: "Apple Pie", price: 11.99, image: "/ApplePie.jpg", isActive: true },
      { category: "desserts", name: "Chocolate Ice Cream", price: 4.99, image: "/Icecream.jpg", isActive: true },
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
      { category: "drinks", name: "Small Neuron Fizz", price: 2.79, image: "/NeuronFizz.jpg", isActive: true  },
      { category: "drinks", name: "Large Neuron Fizz", price: 3.29, image: "/NeuronFizz.jpg", isActive: true  },
      { category: "drinks", name: "Small Nexus Nectar", price: 2.79, image: "/NexusNectar.jpg", isActive: true  },
      { category: "drinks", name: "Large Nexus Nectar", price: 3.29, image: "/NexusNectar.jpg", isActive: true },
      { category: "drinks", name: "Small Circuit Surge", price: 2.79, image: "/CircuitSurge.jpg", isActive: true  },
      { category: "drinks", name: "Large Circuit Surge", price: 3.29, image: "/CircuitSurge.jpg", isActive: true  },
      { category: "drinks", name: "Small Binary Burst", price: 2.79, image: "/BinaryBurst.jpg", isActive: true },
      { category: "drinks", name: "Large Binary Burst", price: 3.29, image: "/BinaryBurst.jpg", isActive: true  },
      { category: "drinks", name: "Small Quantum Cola", price: 2.79, image: "/QuantumCola.jpg", isActive: true  },
      { category: "drinks", name: "Large Quantum Cola", price: 3.29, image: "/QuantumCola.jpg", isActive: true  },
      { category: "drinks", name: "Small Plasma Pop", price: 2.79, image: "/PlasmaPop.jpg", isActive: true  },
      { category: "drinks", name: "Large Plasma Pop", price: 3.29, image: "/PlasmaPop.jpg", isActive: true  }
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
      { category: "sides", name: "Salad", price: 6.99, image: "/Salad.jpeg", isActive: true},
      { category: "sides", name: "4ct Breadsticks", price: 4.99, image: "/Breadsticks.jpg", isActive: true},
      { category: "sides", name: "6ct Breadsticks", price: 6.99, image: "/Breadsticks.jpg", isActive: true},
      { category: "sides", name: "8ct Wings", price: 11.99, image: "/Wings.jpg", isActive: true},
      { category: "sides", name: "12ct Wings", price: 13.99, image: "/Wings.jpg", isActive: true},
      { category: "sides", name: "Marinara Cup", price: .99, image: "/MarinaraCupWithLogo.jpg", isActive: true},
      { category: "sides", name: "Icing Cup", price: 1.99, image: "/IcingCup.jpg", isActive: true}
      

    ]
    const sides = await Promise.all(sidesToCreate.map(createSides))

    console.log(sides)
    console.log("Finished Creating Sides")

  } catch(error) {
    console.log(error)
  }
}

async function createInitialToppings() {
  console.log("Starting to create toppings...")
  try {
    const toppingsToCreate = [
      { name: "Pepperoni", price: 3.99, image: "/1-Pepperoni.png", isActive: true},
      { name: "Sausage", price: 3.99, image: "/2-Sausage.png", isActive: true},
      { name: "GreenPepper", price: 2.99, image: "/3-GreenPepper.png", isActive: true},
      { name: "Onion", price: 2.99, image: "/4-Onions.png", isActive: true},
      { name: "Black Olives", price: 2.99, image: "/5-BlackOlive.png", isActive: true},
      { name: "24-Carat Gold Flakes", price: 6.99, image: "/6-Gold.png", isActive: true}
    ]
    const toppings = await Promise.all(toppingsToCreate.map(createToppings))

    console.log(toppings)
    console.log("Finished creating toppings")
  } catch(error) {
    console.log(error)
  }
}

async function createPizzaWithToppings() {
  console.log("Starting to create a pizza with toppings...")
  try {

    console.log("Creating initial pizza ID...");

    const createdPizza = await createPizza();
    const secondCreatedPizza = await createPizza();

    console.log(createdPizza)
    console.log("this is createdpizza.id ....." + createdPizza.id)
    console.log("Finished creating initial pizza ID...");

    console.log("Adding rows to pizzaWithToppings table...");
    
    const pizzaWithToppingsTableRows = [
      { 
        pizzaId: createdPizza.id,
        toppingsId: 1,
        count: 1
      },
      { 
        pizzaId: createdPizza.id,
        toppingsId: 3,
        count: 2
      },
      { 
        pizzaId: secondCreatedPizza.id,
        toppingsId: 4,
        count: 1
      }
    ];
    
    const pizzaWithToppings = await Promise.all(pizzaWithToppingsTableRows.map(addToppingsToPizza));
    console.log(pizzaWithToppings)
    console.log("Finished creating pizzaWithToppings rows")
  } catch(error) {
    console.log(error)
  }
}

async function createInitialCartsWithoutUser () {
  console.log("Starting to create a cart without a user...")
  try {
    const createdCart = await createCartWithoutUser();
    const createdCart2 = await createCartWithoutUser();
    const createdCart3 = await createCartWithoutUser();

    console.log(createdCart)
    console.log("this is createdcart.id ....." + createdCart.id)
    console.log("Finished creating initial cart ID...");

    console.log("Adding rows to carts table...");
    
    const CartsTableRows = [
      { 
        cartId: createdCart.id,
        totalCost: 15.99
      },
      { 
        cartId: createdCart2.id,
        totalCost: 20.99
      }
    ];
    
    const carts = await Promise.all(CartsTableRows.map(checkoutCart));
    console.log(carts)
    console.log("Finished creating carts rows with no user")
  } catch(error) {
    console.log(error)
  }
}

async function createInitialCartsForUser () {
  console.log("Starting to create a cart for a user...")
  try {
    const createdCart = await createCartForUser(2);
    const createdCart2 = await createCartForUser(2);
    const createdCart3 = await createCartForUser(2);

    console.log(createdCart)
    console.log("this is createdcart.id for a user....." + createdCart.id)
    console.log("this is createdcart.userid for a user....." + createdCart.userId)
    console.log("Finished creating initial cart ID for a user...");

    console.log("Adding rows to carts table...");
    
    const CartsTableRows = [
      { 
        cartId: createdCart.id,
        totalCost: 99
      },
      { 
        cartId: createdCart2.id,
        totalCost: 55
      },
      { 
        cartId: createdCart3.id,
        totalCost: 110
      }
    ];
    
    const carts = await Promise.all(CartsTableRows.map(checkoutCart));
    console.log(carts)
    console.log("Finished creating carts rows for user")
  } catch(error) {
    console.log(error)
  }
}

async function createInitialOrderItemsRowsForCartsUsingProducts() {
  console.log("Starting to create orderItems rows for a cart using products...")
  try {
    const createdRow = await createOrderItemsRowForProduct({cartId:1, productId:2, count:1, cost:9.99, productName: "Cinnamon Twists"});
    const createdRow2 = await createOrderItemsRowForProduct({cartId:2, productId:4, count:2, cost:17.99, productName: "Chocolate Ice Cream"});
    const createdRow3 = await createOrderItemsRowForProduct({cartId:1, productId:3, count:2, cost:69.99, productName: "Apple Pie"});

    console.log(createdRow)
    console.log("this is createdRow.id ....." + createdRow.id)
    console.log("this is createdcart.cartid ....." + createdRow.cartId)
    console.log("Finished creating initial rows for orderItems...");

  } catch(error) {
    console.log(error)
  }
}

async function createInitialOrderItemsRowsForCartsUsingPizza() {
  console.log("Starting to create orderItems rows for a cart using pizza...")
  try {
    const createdRow = await createOrderItemsRowForPizza({cartId:1, pizzaId:2, count:1, cost: 111111.99});
    const createdRow2 = await createOrderItemsRowForPizza({cartId:2, pizzaId:1, count:2, cost:2222222.99});
    const createdRow3 = await createOrderItemsRowForPizza({cartId:1, pizzaId:1, count:2, cost:3333333.99});

    console.log(createdRow)
    console.log("this is createdRow.id ....." + createdRow.id)
    console.log("this is createdcart.cartid ....." + createdRow.cartId)
    console.log("Finished creating initial rows for orderItems...");

  } catch(error) {
    console.log(error)
  }
}

async function createInitialPaymentInformationForOrder() {
  console.log("Starting to create payment information for orders...")
  try {
    const initialPaymentInformation = [
      { cartId: 1, cardholderName: "sam", cardNumber: "123123123", expirationDate: "12/12/2023", cvv: "123", billingAddress: "123 fake street"},
      { cartId: 2, cardholderName: "bob", cardNumber: "456456456", expirationDate: "12/12/2024", cvv: "456", billingAddress: "456 fake street"},
      { cartId: 3, cardholderName: "carlyle", cardNumber: "789789789", expirationDate: "12/12/2025", cvv: "789", billingAddress: "789 fake street"}
    ]
    const paymentInformation = await Promise.all(initialPaymentInformation.map(createPaymentInformationForOrderRow))

    console.log(paymentInformation)
    console.log("Finished creating payment information for orders")
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
    await createAdminUsers();
    await createInitialDesserts();
    await createInitialDrinks();
    await createInitialSides();
    await createInitialToppings();
    await createPizzaWithToppings();
    await createInitialCartsWithoutUser();
    await createInitialCartsForUser();
    await createInitialOrderItemsRowsForCartsUsingProducts();
    await createInitialOrderItemsRowsForCartsUsingPizza();
    await createInitialPaymentInformationForOrder();
  } catch (error) {
    console.log("Error during rebuildDB")
    throw error
  }
}

rebuildDB()
  .catch(console.error)
  .finally(() => client.end());