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

module.exports = {
    createPaymentInformationForOrderRow,
}