const { client } = require("./client")

async function createToppings({name, price}) {
    try {
        const {rows} = await client.query(`
        INSERT INTO toppings (name, price)
        VALUES ($1, $2)
        ON CONFLICT (name) DO NOTHING
        RETURNING *;
        `, [name, price])

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

// Can't really test this new CRUD operation (DELETE) without there being a toppings route...
// async function deleteToppings(id) {
//     try {
//         const topping = await getToppingById(id);
//         if (!topping) {
//             throw {
//                 name: 'ToppingNotFoundError',
//                 message: 'Could not find a dessert with that id'
//             }
//         }
//         await client.query(`
//             DELETE FROM products
//             WHERE id=$1 AND category='toppings';
//         `, [id]);

//         return topping;
//     } catch (error) {
//       throw error;
//     }
// }

module.exports = {
    createToppings,
    getAllToppings,
    getToppingsById,
    updateToppings
    // deleteToppings
}
