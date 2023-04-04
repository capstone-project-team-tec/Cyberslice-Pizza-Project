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

async function checkoutCart({ id, isCheckedOut, totalCost }) {
    try {
            const { rows } = await client.query(`
                UPDATE carts
                SET "isCheckedOut" = $2, "totalCost" = $3
                WHERE id = $1;
            `, [id, isCheckedOut, totalCost]);
        } catch(error) {
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

module.exports = {
    createCartWithoutUser,
    createCartForUser,
    createOrderItemsRowForProduct,
    checkoutCart
}