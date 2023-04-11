const { client } = require("./client");


// cart table functions
async function createCartWithoutUser() {
    try {
        const { rows } = await client.query(`
            INSERT INTO carts ("userId", "isCheckedOut", "totalCost")
            VALUES (NULL, false, NULL)
            RETURNING *;
        `);
        console.log("This is rows zero:   ",rows[0])
        return rows[0];
    } catch(error) {
        console.log(error);
    }
}

async function createCartForUser(userId) {
    try {
        const { rows } = await client.query(`
            INSERT INTO carts ("userId", "isCheckedOut", "totalCost")
            VALUES ($1, false, NULL)
            RETURNING *;
        `, [userId]);
        return rows[0];
    } catch(error) {
        console.log(error);
    }
}

async function checkoutCart({ cartId, totalCost }) {
    try {
            const { rows } = await client.query(`
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

async function fetchUserCarts(userId) {
    try {

        const {rows } = await client.query(`
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


// orderItems table functions
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

async function fetchOrderItemsByCartId(cartId) {
    console.log("starting to fetch order items by cart id")
    try {

        const {rows } = await client.query(`
            SELECT * FROM "orderItems"
            WHERE "cartId"=$1;
        `,[cartId]);

        // if (!orderItems || orderItems.length == 0) {
        //     return null
        // }
        console.log("This is the order items return", rows)
        return rows;

    } catch (error) {
        console.log(error);
    }
}

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
    updateOrderItem
}