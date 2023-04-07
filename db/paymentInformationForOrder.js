const { client } = require("./client");


async function createPaymentInformationForOrderRow({cartId, cardholderName, cardNumber, expirationDate, cvv, billingAddress}) {
    try {
        const {rows} = await client.query(`
        INSERT INTO "paymentInformationForOrder" ("cartId", "cardholderName", "cardNumber", "expirationDate", cvv, "billingAddress")
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT ("cartId") DO NOTHING
        RETURNING *;
        `, [cartId, cardholderName, cardNumber, expirationDate, cvv, billingAddress])

        return rows;

    } catch(error) {
        console.log(error)
    }
}

async function editPaymentInformation(cartId) {

}

async function getDessertById(id) {
    console.log("Starting getDessertById");
    try {
        const {rows: [product] } = await client.query(`
        SELECT * FROM products
        WHERE id=$1 AND category='desserts';
        `, [id])

        console.log("Finished getDessertById");
        return product

    } catch(error) {
        console.log(error)
    }
}



module.exports = {
    createPaymentInformationForOrderRow,
}