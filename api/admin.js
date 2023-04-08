const express = require("express");
const { requireAdmin } = require("./utils");
const adminRouter = express.Router()
require("dotenv").config()

const { 
    createProduct,
    fetchAllProducts,
    updateProduct,
    deleteProduct,
    getProductById,
    getAllUsers,
    getUserById,
    getUserByUsername,
    fetchAllUsers,
    updateUser,
    deleteUser
} = require('../db/admin');

adminRouter.use((req,res,next)=>{
    console.log("A request is being made to /products");
    next();
})

adminRouter.get('/products', async(req,res,next)=>{
    try {
        const products = await fetchAllProducts();
        res.send( products );
      } catch (error) {
        next(error);
      }
})

adminRouter.get('/users', async(req,res,next)=>{
  console.log("get all users request is running")
  try {
      const users = await fetchAllUsers();
      res.send( users );
    } catch (error) {
      next(error);
    }
})

adminRouter.patch('/:productId', async (req, res, next) => {
    const id = req.params.productId;
    console.log("productsRouter.patch; productId: " + id);
    const { catergory, name, price } = req.body;
  
    console.log(name);
    console.log(price);
    const updateFields = {};

    if (catergory) {
        updateFields.catergory = catergory
    }
  
    if (name) {
      updateFields.name = name;
    }
  
    if (price) {
      updateFields.price = price;
    }
  
    try {
      const updatedProduct = await updateProduct({id, fields: updateFields});
      console.log("Updated product: " + updatedProduct);
      res.send(updatedProduct);
    } catch ({ name, message }) {
      next({ name, message });
    }
  });
  
  adminRouter.get('/:productId', async (req, res, next) => {
    const products = await getProductById(req.params.productId);
    if (!req.params.productId) {
      console.log(error);
      next(error);
    }
    try {
      res.send(
        products
      );
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

  adminRouter.delete('/:productId', async (req, res, next) => {
    if (!req.params.productId) {
      console.log(error);
      next(error);
    }
    try {
      const deletedProduct = await deleteProduct(req.params.productId);
      res.send(deletedProduct);
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

  adminRouter.patch(`/:id`, requireAdmin, async (req, res, next) => {
    // const id = req.params.id
    console.log(req.user)
    const { id } = req.params
    const { username, name, email, address, phone} = req.body
    const updateFields = {}
    if(id) {
        updateFields.id = id
    }
    if (username) {
        updateFields.username = username
    }
    if (name) {
        updateFields.name = name
    }
    if (email) {
        updateFields.email = email
    }
    if (address) {
        updateFields.address = address
    }
    if (phone) {
        updateFields.phone = phone
    }
    
    
    try {
      if (!id) {
        res.send({
              name: 'UserNotFoundError',
              message: 'Could not find a user with that username'
        })
      } else {
        const updatedUser = await updateUser(updateFields)
        console.log(updatedUser)
        res.send(updatedUser)
      }
    } catch(error) {
        console.log(error)
    }
})

  adminRouter.delete('/:id', requireAdmin, async (req, res, next) => {

    // const { username } = req.user
    const { id } = req.params
    try {
    const id = await getUserByUsername(username);
      if (!id) {
          res.send( {
              name: 'UserNotFoundError',
              message: 'Could not find a user with that username'
          } )
      } else { 
    // const { id } = req.user
        await deleteUser(id)
        res.send({
            success: true,
            message: "User was successfully deleted"
        })
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  });


module.exports = adminRouter


