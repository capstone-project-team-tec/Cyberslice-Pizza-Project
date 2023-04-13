const express = require("express");
const { createHashRouter } = require("react-router-dom");
const cartRouter = express.Router();

// Database function wrappers.
const { 
    createCartWithoutUser,
    createCartForUser,
    checkoutCart,
    fetchUserCarts,
    createOrderItemsRowForProduct,
    createOrderItemsRowForPizza,
    fetchOrderItemsByCartId,
    deleteRowProducts,
    deleteRowPizza,
    updateOrderItem,
    orderOptionsCartInsertOrderLocationorDeliveryAddress
} = require('../db/cart');

// Payment information function wrapper.
const {
    createPaymentInformationForOrderRow
} = require('../db/paymentInformationForOrder');

require('dotenv').config();

// Logs a message for every request made.
cartRouter.use((req,res,next)=>{
  console.log("A request is being made to /cart");
  next();
})

// GET the cart of the user.
cartRouter.get('/', async (req, res, next) => {
  if ('user' in req && "id" in req.user) {
    console.log("the cart router is running....")
    try {
      console.log('a user id has been found!!!!!')
      const userId = req.user.id;
      console.log("this is the fetch user cart route userId on the cart: ",userId)
      const userCarts = await fetchUserCarts(userId);
      console.log("these are the user's carts:   " + userCarts);
      if (userCarts) {
        res.send(userCarts);
      } else {
        res.status(404).send({
          status: 'not_found',
          failure: true,
          message: `No carts found for user with ID: ${userId}`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    res.status(400).send({ 
      query: JSON.stringify(req.body.userId),
      message: "The name parameter is missing" });
  }
});

// GET the order items from a Cart given its ID.
cartRouter.get('/:cartId', async (req, res, next) => {
    const id = req.params.cartId;
    console.log("fetching orderItems entries per cart id; cartId: " + id);
        try {
            const currentCartOrderItems = await fetchOrderItemsByCartId(id);
            console.log("these are the current cart's order items...." + currentCartOrderItems);
            res.send(currentCartOrderItems);
        } catch (error) {
            console.log(error);
        }
    } 
);

// POST a new row in the carts table, generating a new cart for the user.
cartRouter.post('/', async (req, res, next) => {
    try {
        const { userId } = req.body;
        let newCart;

        if (userId) {
            newCart = await createCartForUser(userId);
        } else {
            newCart = await createCartWithoutUser();
        }

        if (newCart) {
            res.status(200).send({
                success: true,
                error: null,
                id: newCart.id,
                userId: newCart.userId,
                isCheckedOut: newCart.isCheckedOut,
                totalCost: newCart.totalCost,
                message: userId ? "A new row has been created in carts table for the user" : "A new row has been created in carts table"
            });
        } else {
            res.status(403).send({
                success: false,
                error: {
                    name: "createCartError",
                    message: userId ? "Failed to create a new row in carts table for the user" : "Failed to create a new row in carts table"
                },
                data: null
            });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
});

// POST a new order item row with given values.
cartRouter.post('/orderitems', async (req, res, next) => {
    try {
        const { cartId, productId, pizzaId, count, cost, productName, pizzaName } = req.body;
        let newOrderItemsRow;

        if (productId) {
            newOrderItemsRow = await createOrderItemsRowForProduct({cartId:cartId, productId:productId, count:count, cost:cost, productName:productName});
        } else if (pizzaId) {
            newOrderItemsRow = await createOrderItemsRowForPizza({cartId:cartId, pizzaId:pizzaId, count:count, cost:cost, pizzaName:pizzaName});
        } else {
            console.log("Neither a product id nor a pizza id was found.")
        }

        if (newOrderItemsRow) {
            res.status(200).send({
                success: true,
                error: null,
                message: productId ? "A new row has been created in order items table for a product." : "A new row has been created in order items table for a pizza."
            });
        } else {
            res.status(403).send({
                success: false,
                error: {
                    name: "createOrderItemsRowError",
                    message: productId ? "Failed to create a new row in orderItems table for a product." : "Failed to create a new row in orderItems table for a pizza."
                },
                data: null
            });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
});

// POST a new row in the paymentInformationTable to hold payment info.
cartRouter.post('/:cartId/payment', async (req, res, next) => {
    try {
        const cartId = req.params.cartId;
        const { cardholderName, cardNumber, expirationDate, cvv, billingAddress } = req.body;
        const newPaymentRow = await createPaymentInformationForOrderRow({cartId: cartId, cardholderName: cardholderName, cardNumber: cardNumber, expirationDate: expirationDate, cvv: cvv, billingAddress: billingAddress});

        if (newPaymentRow) {
            res.status(200).send({
                success: true,
                error: null,
                message: "A new row has been created in paymentInformationForOrder table."
            });
        } else {
            res.status(403).send({
                success: false,
                error: {
                    name: "createPaymentInformationForOrderRowError",
                    message: "Failed to create a new row in paymentInformationForOrder table." 
                },
                data: null
            });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
})

// PATCH the cart's order items cartId, delivery, and order location.
cartRouter.patch('/:cartId/orderoptions', async (req, res, next) => {
    console.log("Patching order items in cart is running")
        const cartId = req.params.cartId;
        const { deliveryAddress, orderLocation } = req.body;

        const updatedFields = {}

        if(cartId) {
            updatedFields.cartId = cartId
        }
        if (deliveryAddress) {
            updatedFields.deliveryAddress = deliveryAddress
        }
        if (orderLocation) {
            updatedFields.orderLocation = orderLocation
        }
    try {
        
        const orderoptionsrow = await orderOptionsCartInsertOrderLocationorDeliveryAddress(updatedFields)
        console.log("Patching order items in cart is finished")
        res.send(orderoptionsrow)

    } catch(error) {
        console.log(error)
    }
})

// PATCH the order location.
cartRouter.patch('/:cartId/orderlocation', async (req, res, next) => {
    const cartId = req.params.cartId;
    console.log("Patch request for locations is running")
    const { orderLocation } = req.body;

    const  updateFields = {};

    if (cartId) {
        updateFields.cartId = cartId
    }
    
    if (orderLocation) {
        updateFields.orderLocation = orderLocation
    }
    try {
        const updateLocation = await orderOptionsCartUpdateOrderLocation(updateFields);
        res.send(updateLocation)
    } catch(error) {
        console.log(error)
    }
})

// PATCH a cart's ID and total cost by its ID.
cartRouter.patch('/:cartId', async (req, res, next) => {
    const cartId = req.params.cartId;
    console.log("cartRouter.patch; cartId: " + cartId);
    const { totalCost } = req.body;
  
    console.log("this is line 83" + totalCost);
  
    const updateFields = {};
  
    if (cartId) {
        updateFields.cartId = cartId;
    }
  
    if (totalCost) {
      updateFields.totalCost = totalCost;
    } 
  
    try {
      const checkedOutCart = await checkoutCart(updateFields);
      res.send(checkedOutCart);
    } catch ({ name, message }) {
      next({ name, message });
    }
})


// PATCH updates an order items count.
cartRouter.patch('/orderitems/:orderItemId', async (req, res, next) => {
    const orderItemId = req.params.orderItemId;
    console.log("cartRouter.patch for order items; orderItemsId: " + orderItemId);
    const { count, cost } = req.body;
  
    console.log("this is the cartRouter.patch for order items count:",count);
  
    const updateFields = {};
  
    if (orderItemId) {
        updateFields.orderItemId = orderItemId;
    }
  
    if (count) {
      updateFields.count = count;
    } 
  
    try {
      const updatedOrderItem = await updateOrderItem(updateFields);
      res.send(updatedOrderItem);
    } catch ({ name, message }) {
      next({ name, message });
    }
})

// DELETE a product on the cart by its ID.
cartRouter.delete("/orderitems/:productId", async (req, res, next) => {
    const { productId } = req.params

    const { cartId } = req.body;
    console.log("productId: " + productId);
    console.log("cartID: " + cartId);
    try {
        if(!productId || !cartId) {
            res.send({
                name: "ProductNotFoundError",
                message: "Cannot Delete This Product"
            })
        } else {
            const deletedProduct = await deleteRowProducts(productId, cartId)
            res.send({
                success: true,
                deletedProduct: `The deleted product: ${deletedProduct}`,
                message: "Product was successfully deleted from cart"
            })
        }
    } catch({name, message}) {
        console.log({name, message})
    }
})


// DELETE a pizza in the cart by its ID.
cartRouter.delete("/orderitems/:pizzaId", async (req, res, next) => {
    const { pizzaId } = req.params
    try {
        if(!pizzaId) {
            res.send({
                name: "ProductNotFoundError",
                message: "Cannot Delete This Pizza"
            })
        } else {
            const deletedPizza = await deleteRowPizza(pizzaId)
            res.send({
                success: true,
                deletedPizza: deletedPizza,
                message: "Pizza was successfully deleted from cart"
            })
        }
    } catch({name, message}) {
        console.log({name, message})
    }
})

module.exports = cartRouter