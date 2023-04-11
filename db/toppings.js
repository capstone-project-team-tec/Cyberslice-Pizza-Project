const { client } = require("./client")

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
    // deleteToppings
}
