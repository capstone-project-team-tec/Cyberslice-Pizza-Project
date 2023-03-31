const {client} = require("./client");
const bcrypt = require("bcrypt");

// Check for the same user?
async function createUser({username, password, email, address, phone}) {
    try {
        const saltCount = 12;
        const hashedPassword = await bcrypt.hash(password, saltCount);
        const hashedEmail = await bcrypt.hash(email, saltCount);
        const hashedAddress = await bcrypt.hash(address, saltCount);
        const hashedPhone = await bcrypt.hash(phone, saltCount);

        const {rows} = await client.query(`
        INSERT INTO users(username, password, email, address, phone)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT DO NOTHING
        RETURNING  *;
        `, [username, hashedPassword, hashedEmail, hashedAddress, hashedPhone]);

        return rows
    } catch(error) {
        console.log(error)
    }
}

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

        const hashedEmail = user.email;
    
        const isValidEmail = await bcrypt.compare(email, hashedEmail);
        if (!isValidEmail) {
          throw new Error('Invalid email');
        }

        const hashedAddress = user.address;
    
        const isValidAddress = await bcrypt.compare(address, hashedAddress);
        if (!isValidAddress) {
          throw new Error('Invalid address');
        }
    
        const hashedPhone = user.phone;
    
        const isValidPhone = await bcrypt.compare(phone, hashedPhone);
        if (!isValidPhone) {
          throw new Error('Invalid phone number');
        }

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
    try {
        const {rows} = await client.query(`
            SELECT id, username, password 
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

module.exports = {
    createUser,
    getUser,
    getUserById,
    getUserByUsername,
  }