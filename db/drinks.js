const {client} = require("./client")

// Create drinks into the products table.
async function createDrinks({category, name, price, image}) {
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

// Get all the drinks from the products table.
async function getAllDrinks() {
    try {
        const {rows} = await client.query(`
        SELECT * FROM products
        WHERE category='drinks';
        `)
        
        return rows;
    } catch (error) {
        console.log(error)
    }
}

// Get a drink by their ID.
async function getDrinkById(id) {
    try {
        const {rows: [product]} = await client.query(`
        SELECT * FROM products
        WHERE id=$1 AND category='drinks';
        `, [id])

        return product
    } catch(error) {
        console.log(error)
    }
}

// Update drinks.
async function updateDrinks({id, fields = {} }) {
    console.log("Starting updateDrinks");

    const setString = Object.keys(fields).map(
        (key, index) => `"${key}"=$${index + 1}`
    ).join(', ');

    try {
        const result = await client.query(`
            UPDATE products
            SET ${setString}
            WHERE id=$${Object.values(fields).length + 1} AND category='drinks'
            RETURNING *;
            `, [...Object.values(fields), id]
        );

        if (result.rowCount > 0) {
            console.log("Finished updateDrinks");
            return await getDrinkById(id);
        } else {
            throw new Error("No rows updated.");
        }
    } catch(error) {
        console.log(error);
        throw error;
    }
}

// Delete a drink when given their ID.
async function deleteDrink(id) {
    try {
        const drink = await getDrinkById(id);
        if (!drink) {
            throw {
                name: 'DessertNotFoundError',
                message: 'Did not find a dessert with that id'
            }
        }
        await client.query(`
            DELETE FROM products
            WHERE id=$1 AND category='drinks';
        `, [id]);

        return drink;
    } catch (error) {
      throw error;
    }
}

module.exports = {
    createDrinks,
    getAllDrinks,
    getDrinkById,
    updateDrinks,
    deleteDrink
}
