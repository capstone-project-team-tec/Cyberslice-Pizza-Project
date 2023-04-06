const express = require("express");
const { createHashRouter } = require("react-router-dom");
const cartRouter = express.Router();

const { 
    createCartWithoutUser,
    createCartForUser,
    checkoutCart,
    fetchUserCarts,
    createOrderItemsRowForProduct,
    createOrderItemsRowForPizza,
    fetchOrderItemsByCartId,
    deleteRowProducts,
    deleteRowPizza
} = require('../db/cart');

//dependency imports
require('dotenv').config();
// Do we even need this?
// const jwt = require('jsonwebtoken');
// const bcrypt = require("bcrypt");

// const { requireUser } = require('./utils');

cartRouter.use((req,res,next)=>{
  console.log("A request is being made to /cart");
  next();
})

cartRouter.get('/', async (req, res, next) => {
  if (req.user.id) {
    console.log("the cart router is running....")
    try {
      console.log('a user id has been found!!!!!')
      const userId = req.user.id;
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

cartRouter.delete("/orderitems/:productId", async (req, res, next) => {
    const { productId } = req.params
    try {
        if(!productId) {
            res.send({
                name: "ProductNotFoundError",
                message: "Cannot Delete This Product"
            })
        } else {
            const deletedProduct = await deleteRowProducts(productId)
            res.send({
                success: true,
                deletedProduct: deletedProduct,
                message: "Product was successfully deleted from cart"
            })
        }
    } catch({name, message}) {
        console.log({name, message})
    }
})

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