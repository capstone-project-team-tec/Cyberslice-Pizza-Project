const { client } = require("./client");

// Create a dessert in the products table.
async function createDessert({category, name, price, image}) {
    try {
        const {rows} = await client.query(`
        INSERT INTO products (category, name, price, image)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (name) DO NOTHING
        RETURNING *;
        `, [category, name, price, image ])

        return rows;

    } catch(error) {
        console.log(error)
    }
}

// Get all desserts from the products table.
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

// Get a dessert by its ID.
async function getDessertById(id) {
    console.log("Starting getDessertById");
    try {
        const {rows: [product] } = await client.query(`
        SELECT * FROM products
        WHERE id=$1 AND category='desserts';
        `, [id])

        console.log("Finished getDessertById");
        return product

    } catch(error) {
        console.log(error)
    }
}

// Update a dessert.
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

// Delete a dessert by its ID.
async function deleteDessert(id) {
    try {
        const dessert = await getDessertById(id);
        if (!dessert) {
            throw {
                name: 'DessertNotFoundError',
                message: 'Could not find a dessert with that id'
            }
        }
        await client.query(`
            DELETE FROM products
            WHERE id=$1 AND category='desserts';
        `, [id]);

        return dessert;
    } catch (error) {
      throw error;
    }
}

module.exports = {
    createDessert,
    getAllDesserts,
    getDessertById,
    updateDesserts,
    deleteDessert,
}