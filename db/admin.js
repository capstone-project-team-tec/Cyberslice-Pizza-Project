const { client } = require('./client')

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

async function createProduct({category, name, price, image}) {
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



async function updateProduct({id, fields = {} }) {
    console.log("Starting updateDesserts");

    const setString = Object.keys(fields).map(
        (key, index) => `"${key}"=$${index + 1}`
    ).join(', ');

    try {
        const result = await client.query(`
            UPDATE products
            SET ${setString}
            WHERE id=$${Object.values(fields).length + 1}
            RETURNING *;
            `, [...Object.values(fields), id]
        );

        if (result.rowCount > 0) {
            console.log("Finished updateProducts");
            return await getProducById(id);
        } else {
            throw new Error("No rows updated.");
        }
    } catch(error) {
        console.log(error);
        throw error;
    }
}

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

async function getAllUsers() {
    try {
        const {rows} = await client.query(`
        SELECT * FROM users
        WHERE id=$1;
        `)
        
        return rows;
    } catch (error) {
        console.log(error)
    }
  }

  async function getUserByUsername(userName) {
    console.log("Getting user by username, testing logging in");
      try {
          const {rows} = await client.query(`
              SELECT *
              FROM users
              WHERE username=$1;
          `, [userName])
  
          // console.log(rows);
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

  async function getUserById(userId) {
    try {

        const {rows: [user] } = await client.query(`
            SELECT id, username FROM users
            WHERE id=$1;
        `,[userId]);

        if (!user) {
            return null
        }

        return user;

    } catch (error) {
        console.log(error);
    }
}

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
    getAllUsers,
    getUserByUsername,
    getUserById,
    updateUser,
    deleteUser,
    fetchAllUsers,
}