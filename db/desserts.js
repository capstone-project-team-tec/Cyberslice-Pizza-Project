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
        const {rows: [product] } = await client.query(`
        SELECT * FROM products
        WHERE id=$1 AND category='desserts';
        `, [id])

        return product

    } catch(error) {
        console.log(error)
    }
}

async function updateDesserts({id, fields = {} }) {
    console.log("Starting updateDesserts");

    const setString = Object.keys(fields).map(
        (key, index) => `"${key}"=$${index + 1}`
    ).join(', ');

    try {
        const result = await client.query(`
            UPDATE products
            SET ${setString}
            WHERE id=$${Object.values(fields).length + 1} AND category='desserts'
            RETURNING *;
            `, [...Object.values(fields), id]
        );

        if (result.rowCount > 0) {
            console.log("Finished updateDesserts");
            return await getDessertById(id);
        } else {
            throw new Error("No rows updated.");
        }
    } catch(error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    createDessert,
    getAllDesserts,
    getDessertById,
    updateDesserts
}