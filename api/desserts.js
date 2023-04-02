const express = require("express");
const dessertsRouter = express.Router();

const { 
    createDessert,
    getAllDesserts,
    updateDesserts,
    getDessertById
} = require('../db/desserts');

//dependency imports
require('dotenv').config();
// Do we even need this?
// const jwt = require('jsonwebtoken');
// const bcrypt = require("bcrypt");

// const { requireUser } = require('./utils');

dessertsRouter.use((req,res,next)=>{
    console.log("A request is being made to /desserts");
    next();
})

dessertsRouter.get('/', async(req,res,next)=>{
    try {
        const desserts = await getAllDesserts();
        res.send( desserts );
      } catch (error) {
        next(error);
      }
})

dessertsRouter.patch('/:dessertId', async (req, res, next) => {
  const id = req.params.dessertId;
  console.log("dessertsRouter.patch; desssertId: " + id);
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
    const updatedDessert = await updateDesserts({id, fields: updateFields});
    console.log("Updated dessert: " + updatedDessert);
    res.send(updatedDessert);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = dessertsRouter