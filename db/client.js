const { Pool, Client } = require('pg');

// Connects to the local postgresql database.
const connectionString = process.env.DATABASE_URL || 'https://localhost:5432/cyberslicepizza';

const client = new Client(connectionString);
// const client = new Pool({
//   connectionString
// //   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
// });

module.exports = {
    client
}
