const {client} = require("./client");
const bcrypt = require("bcrypt");

// Check for the same user?
async function createUser({username, password, name, email, address, phone}) {
    try {
        const saltCount = 12;
        const hashedPassword = await bcrypt.hash(password, saltCount);
        // const hashedEmail = await bcrypt.hash(email, saltCount);
        // const hashedAddress = await bcrypt.hash(address, saltCount);
        // const hashedPhone = await bcrypt.hash(phone, saltCount);

        const {rows} = await client.query(`
        INSERT INTO users(username, password, name, email, address, phone)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT DO NOTHING
        RETURNING  *;
        `, [username, hashedPassword, name, email, address, phone]);

        return rows[0];
    } catch(error) {
        console.log(error)
    }
}

async function createAdminUser({username, password, isAdmin}) {
    try {
        const saltCount = 12;
        const hashedPassword = await bcrypt.hash(password, saltCount);

        const {rows} = await client.query(`
        INSERT INTO admin(username, password, "isAdmin")
        VALUES ($1, $2, $3)
        ON CONFLICT DO NOTHING
        RETURNING *;
        `, [username, hashedPassword, isAdmin]);

        return rows[0]

    } catch (error) {
        console.log(error)
    }
}

async function getAdminUser({ username, password }) {
    console.log("inside of getAdminUser, testing loggin in")
    try {
        const { rows : [user] } = await client.query(`
        SELECT *
        FROM admin 
        WHERE username = $1;
        `, [username])

        if (rows.length === 0) {
            throw new Error("User not found")
        }

        const hashedPassword = user.password;

        const isValidPassword = await bcrypt.compare(password, hashedPassword);
        if (!isValidPassword) {
            throw new Error("Invalid password")
        }
        return user

    } catch(error) {
        console.log(error)
    }
}

async function getUser({ username, password }) {
  console.log("inside of getUser, testing logging in");
    try {
        const { rows : [user] } = await client.query(`
          SELECT * 
          FROM users
          WHERE username = $1;
        `, [username]);
    
        if (rows.length === 0) {
          throw new Error('User not found');
        }

        const hashedPassword = user.password;
    
        const isValidPassword = await bcrypt.compare(password, hashedPassword);
        if (!isValidPassword) {
          throw new Error('Invalid password');
        }

        // const email = user.email;
    
        // const isValidEmail = await bcrypt.compare(email, hashedEmail);
        // if (!isValidEmail) {
        //   throw new Error('Invalid email');
        // }

        // const hashedAddress = user.address;
    
        // const isValidAddress = await bcrypt.compare(address, hashedAddress);
        // if (!isValidAddress) {
        //   throw new Error('Invalid address');
        // }
    
        // const hashedPhone = user.phone;
    
        // const isValidPhone = await bcrypt.compare(phone, hashedPhone);
        // if (!isValidPhone) {
        //   throw new Error('Invalid phone number');
        // }

        return user;
      } catch (error) {
        throw error;
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

async function getAdminUserByUsername(userName) {
    console.log("Getting admin user by username, testing logging in");
    try {
        const {rows} = await client.query(`
        SELECT *
        FROM admin
        WHERE username=$1;
        `, [userName])
        if(rows){
            console.log(rows[0])
            return rows[0];
        }
        else{
            return undefined;
        }
        

    } catch(error) {
        console.log(error)
    }
}

async function getAllUsers() {
  try {
      const {rows} = await client.query(`
      SELECT * FROM users;
      `)
      
      return rows;
  } catch (error) {
      console.log(error)
  }
}

async function updateUser({id, username, name, email, address, phone}) {
    console.log(id, username)
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

async function orderOptionsCartUpdateDeliveryAddress({ id, address }) {
    try {
        const { rows: [user] } = await client.query(`
        UPDATE users
        SET address = $2
        WHERE id = $1
        RETURNING *;
        `, [id, address])

        return user
    } catch(error) {
        console.log(error)
    }
}

// name, email, address, phone
// name=$3, email=$4, address=$5, phone=$6


module.exports = {
    createUser,
    getUser,
    getUserById,
    getUserByUsername,
    getAllUsers,
    updateUser,
    deleteUser,
    createAdminUser,
    getAdminUser,
    getAdminUserByUsername,
    orderOptionsCartUpdateDeliveryAddress
  }