const express = require("express");
const drinksRouter = express.Router();

// Database function wrappers for drinks.
const { 
    createDrink,
    getAllDrinks,
    updateDrinks,
    deleteDrink,
    getDrinkById
} = require('../db/drinks');

// Dependency imports
require('dotenv').config();

// Logs a message for every request made to /drinks
drinksRouter.use((req,res,next)=>{
    console.log("A request is being made to /drinks");
    next();
})

// GET all drinks.
drinksRouter.get('/', async(req,res,next)=>{
    try {
        const drinks = await getAllDrinks();
        res.send(drinks);
      } catch (error) {
        next(error);
      }
})

// PATCH a drinks name and price by its ID.
drinksRouter.patch('/:drinkId', async (req, res, next) => {
  const id = req.params.drinkId;
  console.log("dessertsRouter.patch; drinkId: " + id);
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
    const updateDrink = await updateDrinks({id, fields: updateFields});
    console.log("Updated dessert: " + updateDrink);
    res.send(updateDrink);
  } catch ({name, message}) {
    next({name, message});
  }
});

// GET a drink by its ID.
drinksRouter.get('/:drinkId', async (req, res, next) => {
  const drink = await getDrinkById(req.params.drinkId);
  if (!req.params.drinkId) {
    console.log(error);
    next(error);
  }
  try {
    res.send(drink);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// DELETE a drink by its ID.
drinksRouter.delete('/:drinkId', async (req, res, next) => {
  if (!req.params.drinkId) {
    console.log(error);
    next(error);
  }
  try {
    const deletedDrink = await deleteDrink(req.params.drinkId);
    res.send(deletedDrink);
  } catch ({name, message}) {
    next({name, message});
  }
});
module.exports = drinksRouter