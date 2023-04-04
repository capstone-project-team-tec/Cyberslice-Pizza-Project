const { client } = require("./client");


// cart table functions
async function createCartWithoutUser() {
    try {
        const { rows } = await client.query(`
            INSERT INTO carts ("userId", "isCheckedOut", "totalCost")
            VALUES (NULL, false, NULL)
            RETURNING *;
        `);
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
                WHERE id = $1;
            `, [cartId, totalCost]);
        } catch(error) {
            console.log(error);
        }
}

async function fetchUserCarts(userId) {
    try {

        const {rows: carts } = await client.query(`
            SELECT * FROM carts
            WHERE "userId"=$1;
        `,[userId]);

        if (!carts || carts.length == 0) {
            return null
        }

        return carts;

    } catch (error) {
        console.log(error);
    }
}


// orderItems table functions
async function createOrderItemsRowForProduct({cartId, productId, count, cost}) {
    try {
        const {rows} = await client.query(`
        INSERT INTO "orderItems" ("cartId", "productId", count, cost)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `, [ cartId, productId, count, cost ])

        return rows;

    } catch(error) {
        console.log(error)
    }
}

async function createOrderItemsRowForPizza({cartId, pizzaId, count, cost}) {
    try {
        const {rows} = await client.query(`
        INSERT INTO "orderItems" ("cartId", "pizzaId", count, cost)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `, [ cartId, pizzaId, count, cost ])

        return rows;

    } catch(error) {
        console.log(error)
    }
}

module.exports = {
    createCartWithoutUser,
    createCartForUser,
    checkoutCart,
    fetchUserCarts,
    createOrderItemsRowForProduct,
    createOrderItemsRowForPizza
}