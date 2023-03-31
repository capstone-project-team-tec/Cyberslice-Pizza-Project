async function createDrinks({category, name, price}) {
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


async function getAllDrinks() {
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

async function getSidesById(id) {
    try {
        const {rows: [products] } = await client.query(`
        SELECT * FROM products
        WHERE id=$1, category='sides';
        `)

        return products

    } catch(error) {
        console.log(error)
    }
}

async function updateSides({category, name, price}) {
    try {
        const {rows} = await client.query(`
        UPDATE products 
        SET "name" = $1, "description" = $2
        WHERE category='sides';
        ` [category, name, price])

        return rows;
    } catch(error) {
        console.log(error)
    }
}
