const { client } = require('./client')

// Return all the products in the products table.
async function fetchAllProducts() {
    try {
        const {rows} = await client.query(`
        SELECT * FROM products
        WHERE id=$1;
        `)
        return rows
    } catch(error) {
        console.log(error)
    }
}

// Return all the users in the users table.
async function fetchAllUsers() {
    try {
        const {rows} = await client.query(`
        SELECT * FROM users;
        `)
        return rows
    } catch(error) {
        console.log(error)
    }
}

// Create a new product into the products table.
async function createProduct({category, name, price}) {
    try {
        const {rows} = await client.query(`
        INSERT INTO products (category, name, price, "isActive")
        VALUES ($1, $2, $3, true)
        ON CONFLICT (name) DO NOTHING
        RETURNING *;
        `, [category, name, price])

        return rows[0];
    } catch(error) {
        console.log(error)
    }
}

// Retrieve a product when given a valid ID.
async function getProductById(id) {
    console.log("Starting getProductById");
    try {
        const {rows: [product] } = await client.query(`
        SELECT * FROM products
        WHERE id=$1;
        `, [id])

        console.log("Finished getProductById");
        return product

    } catch(error) {
        console.log(error)
    }
}

// Delete a product when given a valid id.
async function deleteProduct(id) {
    try {
        const product = await getProductById(id);
        if (!product) {
            throw {
                name: 'ProductNotFoundError',
                message: 'Could not find a Product with that id'
            }
        }
        await client.query(`
            DELETE FROM products
            WHERE id=$1;
        `, [id]);

        return product;
    } catch (error) {
      throw error;
    }
}

// Get a user when given a valid username.
async function getUserByUsername(userName) {
    console.log("Getting user by username, testing logging in");
        try {
            const {rows} = await client.query(`
                SELECT *
                FROM users
                WHERE username=$1;
            `, [userName])

            if(rows){
                return rows[0];
            }
            else{
                return undefined;
            }
        } catch (error) {
            console.log(error);
        }
}

// Get a user by their ID.
async function getUserById(userId) {
    try {

        const {rows: [user] } = await client.query(`
            SELECT * FROM users
            WHERE id=$1;
        `,[userId]);

        if (!user) {
            return null
        }
        console.log("This is the getUserById User", user)
        return user;

    } catch (error) {
        console.log(error);
    }
}

// Update a user.
async function updateUser({id, username, name, email, address, phone}) {
    console.log("this is the line 164 id and username", id, username)
    try {
        const { rows: [user] } = await client.query(`
            UPDATE users
            SET username=$2, name=$3, email=$4, address=$5, phone=$6
            WHERE id = $1
            RETURNING *;
        `, [id, username, name, email, address, phone]);
        
        return user;
    } catch(error) {
        console.log(error);
    }
}

// Update a product.
async function updateProduct({id, category, price, isActive}) {
    console.log("Request payload:", {id, category, price, isActive});
    try {
        if (!category) {
            throw new Error("Category value is required.");
        }
        const { rows: [product] } = await client.query(`
            UPDATE products
            SET category=$2, price=$3, "isActive"=$4
            WHERE id = $1
            RETURNING *;
        `, [id, category, price, isActive]);

        return product;
    } catch(error) {
        console.log(error);
    }
}

// Delete a user based off of their id.
async function deleteUser(id) {
    try { 
        await client.query(`
            DELETE FROM users
            WHERE id=$1;
        `, [id]);
  
        return;
    } catch (error) {
      throw error;
    }
}

module.exports = {
    fetchAllProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    getUserByUsername,
    getUserById,
    updateUser,
    deleteUser,
    fetchAllUsers,
}