const {client} = require("./client");
const bcrypt = require("bcrypt");

// this function creates a new user
async function createUser({username, password, name, email, address, phone}) {
    try {
        const saltCount = 12;
        const hashedPassword = await bcrypt.hash(password, saltCount);
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

// this function creates a new admin user
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

// this function is for admin login
async function getAdminUser({ username, password }) {
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

// this function is for user login
async function getUser({ username, password }) {
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
        return user;
    } catch (error) {
        throw error;
    }
}

// this function fetches a user by their id
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

// this function fetches a user by their username
async function getUserByUsername(userName) {
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

// this function fetches an admin user by their username
async function getAdminUserByUsername(userName) {
    try {
        const {rows} = await client.query(`
            SELECT *
            FROM admin
            WHERE username=$1;
        `, [userName])
        if(rows){
            return rows[0];
        }
        else{
            return undefined;
        }
    } catch(error) {
        console.log(error)
    }
}

// this function fetches all users
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

// this function updates a user's information using their id
async function updateUser({id, username, name, email, address, phone}) {
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

// this function deletes a user by their id
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

// this function updates a user's address from the delivery address field input on the order options page
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