const { client } = require("./client")

async function createSides({category, name, price}) {
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
