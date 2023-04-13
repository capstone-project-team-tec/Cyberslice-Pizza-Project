const express = require("express");
const { requireAdmin } = require("./utils");
const adminRouter = express.Router()
require("dotenv").config()

// Database function wrappers
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
    deleteUser,
} = require('../db/admin');

// Logs a message for every request made.
adminRouter.use((req,res,next)=>{
    console.log("A request is being made to /admin");
    next();
})

// GET all the products.
adminRouter.get('/products', async(req,res,next)=>{
    try {
        const products = await fetchAllProducts();
        res.send(products);
      } catch (error) {
        next(error);
      }
})

// GET all users.
adminRouter.get('/users', async(req,res,next)=>{
  console.log("get all users request is running")
  try {
      const users = await fetchAllUsers();
      res.send(users);
    } catch (error) {
      next(error);
    }
})

// GET a user by their ID via the URL's path.
adminRouter.get('/:userId', async (req, res, next) => {
  if (!req.params.userId) {
    console.log(error);
    next(error);
  }
  const user = await getUserById(req.params.userId);
  try {
    console.log("This is the admin router user", user)
    res.send(user);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// PATCH a product through its ID.
adminRouter.patch('/products/:productId', requireAdmin, async (req, res, next) => {
  const id = req.params.productId;
  console.log("productsRouter.patch; productId: " + id);
  const { category, name, price, isActive } = req.body;

  console.log(name);
  console.log(price);
  const updateFields = {};

  if (category) {
      updateFields.category = category
  }

  if (name) {
    updateFields.name = name;
  }

  if (price) {
    updateFields.price = price;
  }

  if (isActive) {
    updateFields.isActive = isActive;
  }
  try {
    const updatedProduct = await updateProduct({ id, ...updateFields });
    console.log("Updated product: " + updatedProduct);
    res.send(updatedProduct);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET a product by its ID.
adminRouter.get('/product/:productId', async (req, res, next) => {
  if (!req.params.productId) {
    console.log(error);
    next(error);
  }
  const product = await getProductById(req.params.productId);
  try {
    res.send(product);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// POST a new product.
adminRouter.post('/createproduct', requireAdmin, async(req,res,next)=> {
  console.log("The create product route is running")
  try {
  const productData = req.body

  if (productData.name && productData.price && (productData.category == 'desserts' || productData.category == 'drinks' || productData.category == 'sides')) {
    let newCreatedProduct = await createProduct({
      name: productData.name,
      category: productData.category,
      price: productData.price
    })
    if (newCreatedProduct) {
      console.log("This is the new created product...",newCreatedProduct);
      res.send(
        {
            success: true,
            error: null,
            message: "Product was successfully created."
        }).status(200)
    } else {
      res.send({
        success: false,
        error: {
          name: "UserError",
          message: "failed to create account"
        },
        data: null
      }).status(403)
    }
  }
  
  } catch(error) {
    console.log(error)
  }
})

// DELETE a product by its ID.
adminRouter.delete('/products/:productId', requireAdmin, async (req, res, next) => {
  if (!req.params.productId) {
    console.log(error);
    next(error);
  }
  try {
    const deletedProduct = await deleteProduct(req.params.productId);
    res.send(deletedProduct);
  } catch ({name, message}) {
    next({name, message});
  }
});

// PATCH a user by their ID.
adminRouter.patch(`/users/:id`, requireAdmin, async (req, res, next) => {
  console.log("This is the admin router patch running")
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

// DELETE a user by their ID.
adminRouter.delete('/users/:id', requireAdmin, async (req, res, next) => {
  const {id} = req.params
  try {
  const id = await getUserByUsername(username);
    if (!id) {
        res.send( {
            name: 'UserNotFoundError',
            message: 'Could not find a user with that username'
        } )
    } else { 
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