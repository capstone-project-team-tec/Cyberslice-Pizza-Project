const { client } = require("./client")

// Create sides in the products table.
async function createSides({category, name, price, image}) {
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

// Get all the sides from the products table.
async function getAllSides() {
    try {
        const {rows} = await client.query(`
        SELECT * FROM products
        WHERE category='sides';
        `)
        
        return rows;
    } catch (error) {
        console.log(error)
    }
}

// Get sides by the ID.
async function getSideById(id) {
    try {
        const {rows: [product] } = await client.query(`
        SELECT * FROM products
        WHERE id=$1 AND category='sides';
        `, [id])

        return product

    } catch(error) {
        console.log(error)
    }
}

// Updates sides from the products table.
async function updateSides({id, fields = {} }) {
    console.log("Starting updateSides");

    const setString = Object.keys(fields).map(
        (key, index) => `"${key}"=$${index + 1}`
    ).join(', ');

    try {
        const result = await client.query(`
            UPDATE products
            SET ${setString}
            WHERE id=$${Object.values(fields).length + 1} AND category='sides'
            RETURNING *;
            `, [...Object.values(fields), id]
        );

        if (result.rowCount > 0) {
            console.log("Finished updateSides");
            return await getSideById(id);
        } else {
            throw new Error("No rows updated.");
        }
    } catch(error) {
        console.log(error);
        throw error;
    }
}

// Delete a side by its ID.
async function deleteSide(id) {
    try {
        const side = await getSideById(id);
        if (!side) {
            throw {
                name: 'SideNotFoundError',
                message: 'Could not find a side with that id'
            }
        }
        await client.query(`
            DELETE FROM products
            WHERE id=$1 AND category='sides';
        `, [id]);

        return side;
    } catch (error) {
      throw error;
    }
}

module.exports = {
    createSides,
    getAllSides,
    getSideById,
    updateSides,
    deleteSide
}
