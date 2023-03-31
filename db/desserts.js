const { client } = require("./client");


async function createDessert({category, name, price}) {
    try {
        const {rows} = await client.query(`
        INSERT INTO products (category, name, price)
        VALUES ($1, $2, $3)
        ON CONFLICT (name) DO NOTHING
        RETURNING *;
        `, [category, name, price ])

        return rows;

    } catch(error) {
        console.log(error)
    }
}


async function getAllDesserts() {
    try {
        const {rows} = await client.query(`
        SELECT * FROM products
        WHERE category ='desserts';
        `)
        
        return rows;
    } catch (error) {
        console.log(error)
    }
}

async function getDessertById(id) {
    try {
        const {rows: [products] } = await client.query(`
        SELECT * FROM products
        WHERE id=$1 AND category='desserts';
        `)

        return products

    } catch(error) {
        console.log(error)
    }
}

async function updateDesserts({category, name, price}) {
    try {
        const {rows} = await client.query(`
        UPDATE products 
        SET "name" = $1, "description" = $2
        WHERE category='desserts';
        ` [category, name, price])

        return rows;
    } catch(error) {
        console.log(error)
    }
}

module.exports = {
    createDessert,
    getAllDesserts,
    getDessertById,
    updateDesserts
}