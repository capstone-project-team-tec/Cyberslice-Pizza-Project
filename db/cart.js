const { client } = require("./client");

// Creates a cart without associating it to a user. For guests.
async function createCartWithoutUser() {
    try {
        const {rows} = await client.query(`
            INSERT INTO carts ("userId", "isCheckedOut", "totalCost", "deliveryAddress", "orderLocation")
            VALUES (NULL, false, NULL, NULL, NULL)
            RETURNING *;
        `);
        console.log("This is rows zero:   ",rows[0])
        return rows[0];
    } catch(error) {
        console.log(error);
    }
}

// Create a cart for a logged in user.
async function createCartForUser(userId) {
    try {
        const {rows} = await client.query(`
            INSERT INTO carts ("userId", "isCheckedOut", "totalCost", "deliveryAddress", "orderLocation")
            VALUES ($1, false, NULL, NULL, NULL)
            RETURNING *;
        `, [userId]);
        return rows[0];
    } catch(error) {
        console.log(error);
    }
}

// Checkout the cart.
async function checkoutCart({cartId, totalCost}) {
    try {
        const {rows} = await client.query(`
            UPDATE carts
            SET "isCheckedOut" = true, "totalCost" = $2
            WHERE id = $1
            RETURNING *;
        `, [cartId, totalCost]);

        return(rows[0]);
    } catch(error) {
        console.log(error);
    }
}

// Updates a carts order locations or delivery address.
async function orderOptionsCartInsertOrderLocationorDeliveryAddress({cartId, deliveryAddress, orderLocation}) {
    try {
        const {rows} = await client.query(`
        UPDATE carts
        SET "deliveryAddress" = $2, "orderLocation" = $3
        WHERE id = $1
        RETURNING *;
        `, [cartId, deliveryAddress, orderLocation])

        return(rows[0])
    } catch(error) {
        console.log(error)
    }
}

// Fetches the current user's carts by their ID.
async function fetchUserCarts(userId) {
    try {
        const {rows} = await client.query(`
            SELECT * FROM carts
            WHERE "userId"=$1;
        `,[userId]);

        if (!rows || rows.length == 0) {
            return null
        }

        return rows;

    } catch (error) {
        console.log(error);
    }
}

// Creates a new row of product information in the orderItems table.
async function createOrderItemsRowForProduct({cartId, productId, count, cost, productName}) {
    try {
        const {rows} = await client.query(`
        INSERT INTO "orderItems" ("cartId", "productId", count, cost, "productName")
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        `, [ cartId, productId, count, cost, productName ])

        return rows;

    } catch(error) {
        console.log(error)
    }
}

// Creates a new row of pizza information in the orderItems table.
async function createOrderItemsRowForPizza({cartId, pizzaId, count, cost, pizzaName}) {
    try {
        const {rows} = await client.query(`
        INSERT INTO "orderItems" ("cartId", "pizzaId", count, cost, "pizzaName")
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        `, [ cartId, pizzaId, count, cost, pizzaName ])

        return rows;

    } catch(error) {
        console.log(error)
    }
}

// Fetches the order items from a cart by their ID.
async function fetchOrderItemsByCartId(cartId) {
    console.log("starting to fetch order items by cart id")
    try {
        const {rows } = await client.query(`
            SELECT * FROM "orderItems"
            WHERE "cartId"=$1;
        `,[cartId]);

        console.log("This is the order items return", rows)
        return rows;

    } catch (error) {
        console.log(error);
    }
}

// Update an orderItem's ID and quantity.
async function updateOrderItem({orderItemId, count}) {
    console.log("the update order items function is running, here is count:  ",count)
    try {
        const { rows: [orderItem] } = await client.query(`
            UPDATE "orderItems"
            SET count = $2
            WHERE id = $1
            RETURNING *;
        `, [orderItemId, count]);
        return orderItem;
    } catch(error) {
        console.log(error);
    }
}

// Delete a product from a cart given their ID's.
async function deleteRowProducts(productId, cartId) {
    console.log("Starting to delete product rows")
    try { 
        console.log("productId: " + productId)
        console.log("cartId: " + cartId)
        const {rows} = await client.query(`
            DELETE FROM "orderItems"
            WHERE "productId"=$1 AND "cartId"=$2
            RETURNING *;
        `, [productId, cartId]);
        console.log(rows[0])
        console.log("This is the rows for delete rows product", rows)
        console.log("Finished deleting product rows")

        return rows[0];
      
    } catch (error) {
      throw error;
    }
}

// Delete a pizza from the orderItems.
  async function deleteRowPizza(pizzaId) {
    console.log("Starting to delete pizza rows")
    try { 
        const {rows} = await client.query(`
            DELETE FROM "orderItems"
            WHERE "pizzaId"=$1
            RETURNING *;
        `, [pizzaId]);
        console.log("Finished deleting pizza rows ")

        return rows[0];
        
        
    } catch (error) {
      throw error;
    }
  }

module.exports = {
    createCartWithoutUser,
    createCartForUser,
    checkoutCart,
    fetchUserCarts,
    createOrderItemsRowForProduct,
    createOrderItemsRowForPizza,
    fetchOrderItemsByCartId,
    deleteRowProducts,
    deleteRowPizza,
    orderOptionsCartInsertOrderLocationorDeliveryAddress,
    updateOrderItem
}