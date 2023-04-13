const { client } = require("./client")

// Create a new row in the Toppings table, with a name, price, and image.
async function createToppings({name, price, image}) {
    try {
        const {rows} = await client.query(`
        INSERT INTO toppings (name, price, image)
        VALUES ($1, $2, $3)
        ON CONFLICT (name) DO NOTHING
        RETURNING *;
        `, [name, price, image])

        return rows;

    } catch(error) {
        console.log(error)
    }
}

// Get all toppings from toppings table.
async function getAllToppings() {
    try {
        const {rows} = await client.query(`
        SELECT * FROM toppings;
        `)
        
        return rows;
    } catch (error) {
        console.log(error)
    }
}

// Get a topping by its ID.
async function getToppingsById(id) {
    try {
        const {rows: [toppings] } = await client.query(`
        SELECT * FROM toppings
        WHERE id=$1;
        `)

        return toppings;

    } catch(error) {
        console.log(error)
    }
}

// Update a topping's name and price.
async function updateToppings({name, price}) {
    try {
        const {rows} = await client.query(`
        UPDATE toppings 
        SET "name" = $1, "price" = $2;
        `, [name, price])

        return rows;
    } catch(error) {
        console.log(error)
    }
}

module.exports = {
    createToppings,
    getAllToppings,
    getToppingsById,
    updateToppings
}
