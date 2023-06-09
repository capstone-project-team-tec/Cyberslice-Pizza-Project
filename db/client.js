const { Pool, Client } = require('pg');

// Dependency imports
require('dotenv').config()
const {TYLER_DATABASE_PASSWORD} = process.env

// Connects to the local postgresql database.
const connectionString = process.env.DATABASE_URL || 'https://localhost:5432/cyberslicepizza';

const client = new Client(connectionString);

if (TYLER_DATABASE_PASSWORD){
    client.password = TYLER_DATABASE_PASSWORD
}
module.exports = {
    client
}