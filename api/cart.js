const express = require("express");
const cartRouter = express.Router();

const { 
    createCartWithoutUser,
    createCartForUser,
    checkoutCart,
    fetchUserCarts,
    createOrderItemsRowForProduct,
    createOrderItemsRowForPizza,
    fetchOrderItemsByCartId
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
  if (req.body.userId) {
    console.log("the cart router is running....")
    try {
      console.log('a user id has been found!!!!!')
      const userId = req.body.userId;
      const userCarts = await fetchUserCarts(userId);
      console.log("these are the user's carts" + userCarts);
      res.send(userCarts);
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
        const { cartId, productId, pizzaId, count, cost } = req.body;
        let newOrderItemsRow;

        if (productId) {
            newOrderItemsRow = await createOrderItemsRowForProduct({cartId:cartId, productId:productId, count:count, cost:cost});
        } else if (pizzaId) {
            newOrderItemsRow = await createOrderItemsRowForPizza({cartId:cartId, pizzaId:pizzaId, count:count, cost:cost});
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

// cartRouter.post('/', async (req, res, next) => {
//         try {
//             let newPizza = await createPizza();
//             if (newPizza) {
//                     res.send(
//                     {
//                         success: true,
//                         error: null,
//                         message: "A new row has been created in pizza table"
//                     }).status(200)
//             } else {
//                 res.send(
//                     {
//                         success: false,
//                         error: {
//                             name: "createPizzaError",
//                             message: "Failed to create a new row in pizza table"
//                         },
//                         data: null
//                     }
//                 ).status(403)
//             }
//         } catch (error) {
//             console.log(error);
//             next(error);
//         }
// })

// cartRouter.patch('/:pizzaId', async (req, res, next) => {
//   const id = req.params.pizzaId;
//   console.log("cartRouter.patch; pizzaId: " + id);
//   const { name, basePizzaCost, size } = req.body;

//   console.log("this is line 57" + name);
//   console.log("this is line 58" + basePizzaCost);
//   console.log("this is line 59" + size);

//   const updateFields = {};

//   if (name) {
//     updateFields.name = name;
//   }

//   if (basePizzaCost) {
//     updateFields.basePizzaCost = basePizzaCost;
//   }

//   if (size) {
//     updateFields.size = size;
//   } 

//   try {
//     const updatePizza = await addDetailsToPizza(id, updateFields);
//     res.send(updatePizza);
//   } catch ({ name, message }) {
//     next({ name, message });
//   }
// });

module.exports = cartRouter