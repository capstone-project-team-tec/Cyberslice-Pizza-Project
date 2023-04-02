const express = require("express");
const sidesRouter = express.Router();

const { 
    createSide,
    getAllSides,
    getSideById,
    updateSides
} = require('../db/sides');

//dependency imports
require('dotenv').config();
// Do we even need this?
// const jwt = require('jsonwebtoken');
// const bcrypt = require("bcrypt");

// const { requireUser } = require('./utils');

sidesRouter.use((req,res,next)=>{
    console.log("A request is being made to /sides");
    next();
})
sidesRouter.get('/', async(req,res,next)=>{
    try {
        const sides = await getAllSides();
        res.send( sides );
      } catch (error) {
        next(error);
      }
})

sidesRouter.patch('/:sideId', async (req, res, next) => {
  const id = req.params.sideId;
  console.log("sidesRouter.patch; sideId: " + id);
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
    const updatedSide = await updateSides({id, fields: updateFields});
    console.log("Updated side: " + updatedSide);
    res.send(updatedSide);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

sidesRouter.get('/:sideId', async (req, res, next) => {
  const side = await getSideById(req.params.sideId);
  if (!req.params.sideId) {
    console.log(error);
    next(error);
  }
  try {
    res.send(
      side
    );
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = sidesRouter