//This is the /db index.js



//Users
async function createUser({username, password}) {
    try {
        const {rows} = await client.query(`
        INSERT INTO users(username, password)
        VALUES ($1,$2)
        ON CONFLICT (username) DO NOTHING
        RETURNING  *;
        ` [username, password])

        return rows
    } catch(error) {
        console.log(error)
    }
}


//Pizza


//Toppings


//Drinks


//Sides


//Desserts


//Cart


//Order Items







module.exports = {}