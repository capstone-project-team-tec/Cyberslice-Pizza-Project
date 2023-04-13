const express = require("express");
const dessertsRouter = express.Router();

// Database function wrappers for desserts.
const { 
    createDessert,
    getAllDesserts,
    updateDesserts,
    deleteDessert,
    getDessertById,
} = require('../db/desserts');

// Dependency imports
require('dotenv').config();

// Logs a message for every request made to /desserts
dessertsRouter.use((req,res,next)=>{
    console.log("A request is being made to /desserts");
    next();
})

// GET all desserts.
dessertsRouter.get('/', async(req,res,next)=>{
    try {
        const desserts = await getAllDesserts();
        res.send(desserts);
      } catch (error) {
        next(error);
      }
})

// PATCH a dessert's name and price by its ID.
dessertsRouter.patch('/:dessertId', async (req, res, next) => {
  const id = req.params.dessertId;
  console.log("dessertsRouter.patch; desssertId: " + id);
  const {name, price} = req.body;

  console.log(name);
  console.log(price);
  const updateFields = {};

  if (name) {
    updateFields.name = name;
  }

  if (price) {
    updateFields.price = price;
  }

  try {
    const updatedDessert = await updateDesserts({id, fields: updateFields});
    console.log("Updated dessert: " + updatedDessert);
    res.send(updatedDessert);
  } catch ({name, message}) {
    next({name, message});
  }
});

// GET a dessert by its ID.
dessertsRouter.get('/:dessertId', async (req, res, next) => {
  const dessert = await getDessertById(req.params.dessertId);
  if (!req.params.dessertId) {
    console.log(error);
    next(error);
  }
  try {
    res.send(dessert);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// DELETE a dessert by its ID.
dessertsRouter.delete('/:dessertId', async (req, res, next) => {
  if (!req.params.dessertId) {
    console.log(error);
    next(error);
  }
  try {
    const deletedDessert = await deleteDessert(req.params.dessertId);
    res.send(deletedDessert);
  } catch ({name, message}) {
    next({name, message});
  }
});

module.exports = dessertsRouter