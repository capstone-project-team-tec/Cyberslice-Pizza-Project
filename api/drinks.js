const express = require("express");
const drinksRouter = express.Router();

const { 
    createDrink,
    getAllDrinks,
    updateDrinks,
    getDrinkById
} = require('../db/drinks');

//dependency imports
require('dotenv').config();
// Do we even need this?
// const jwt = require('jsonwebtoken');
// const bcrypt = require("bcrypt");

// const { requireUser } = require('./utils');

drinksRouter.use((req,res,next)=>{
    console.log("A request is being made to /drinks");
    next();
})
drinksRouter.get('/', async(req,res,next)=>{
    try {
        const drinks = await getAllDrinks();
        res.send( drinks );
      } catch (error) {
        next(error);
      }
})
drinksRouter.patch('/:drinkId', async (req, res, next) => {
  const id = req.params.drinkId;
  console.log("dessertsRouter.patch; drinkId: " + id);
  const { name, price } = req.body;

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
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = drinksRouter