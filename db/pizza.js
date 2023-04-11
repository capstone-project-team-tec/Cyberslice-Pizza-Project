const {client} = require("./client");

// pizza with toppings table functions
async function addToppingsToPizza({pizzaId, toppingsId, count}) {
    try {
        const {rows} = await client.query(`
        INSERT INTO "pizzaWithToppings"("pizzaId", "toppingsId", count)
        VALUES ($1, $2, $3)
        RETURNING  *;
        `, [pizzaId, toppingsId, count]);

        return rows
    } catch(error) {
        console.log(error)
    }
}

async function fetchPizzaWithToppingsInfo({pizzaId}) {
    try {
        const {rows : [user]} = await client.query(`
            SELECT *
            FROM pizzaWithToppings
            WHERE pizzaID = $1;
        `, [pizzaId])
    } catch(error) {
        console.log(error)
    }
}

// pizza table functions
async function createPizza({name, basePizzaCost, pizzaSize}) {
    try {
        const {rows} = await client.query(`
            INSERT INTO pizza (name, "basePizzaCost", size)
            VALUES ($1, $2, $3)
            RETURNING *;
        `,[name, basePizzaCost, pizzaSize]);
        return rows[0];
    } catch(error) {
        console.log(error);
    }
}

async function addDetailsToPizza(id, {name, basePizzaCost, size}) {
    try {
        const {rows} = await client.query(`
            UPDATE pizza
            SET name = $2, "basePizzaCost" = $3, size = $4
            WHERE id = $1;
        `, [id, name, basePizzaCost, size]);
    } catch(error) {
        console.log(error);
    }
}

async function fetchPizzaByName(name) {
    try {
        const {rows: [pizza] } = await client.query(`
        SELECT * FROM pizza
        WHERE name=$1;
        `, [name])
        console.log("LOOK HERE FOR PIZZA IN FETCHPIZZA:  ",pizza)
        if (pizza != undefined) {
            return {
                pizza,
                success: true
            }
        }else{
            return {success: false}
        }
        
    } catch(error) {
        console.log(error);
    }
}

module.exports = {
    addToppingsToPizza,
    fetchPizzaWithToppingsInfo,
    createPizza,
    addDetailsToPizza,
    fetchPizzaByName
  }