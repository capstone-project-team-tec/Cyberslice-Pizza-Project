const express = require("express");
const sidesRouter = express.Router();

// Database function wrappers for sides.
const { 
    createSide,
    getAllSides,
    getSideById,
    updateSides,
    deleteSide
} = require('../db/sides');

// Dependency imports
require('dotenv').config();

// Logs a message for every request made to /sides
sidesRouter.use((req,res,next)=>{
    console.log("A request is being made to /sides");
    next();
})

// GET all the sides.
sidesRouter.get('/', async(req,res,next)=>{
    try {
        const sides = await getAllSides();
        res.send(sides);
      } catch (error) {
        next(error);
      }
})

// PATCH a side by its ID.
sidesRouter.patch('/:sideId', async (req, res, next) => {
  const id = req.params.sideId;
  console.log("sidesRouter.patch; sideId: " + id);
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
    const updatedSide = await updateSides({id, fields: updateFields});
    console.log("Updated side: " + updatedSide);
    res.send(updatedSide);
  } catch ({name, message}) {
    next({name, message});
  }
});

// GET a side by its ID.
sidesRouter.get('/:sideId', async (req, res, next) => {
  const side = await getSideById(req.params.sideId);
  if (!req.params.sideId) {
    console.log(error);
    next(error);
  }
  try {
    res.send(side);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// DELETE a side by its ID.
sidesRouter.delete('/:sideId', async (req, res, next) => {
  if (!req.params.sideId) {
    console.log(error);
    next(error);
  }
  try {
    const deletedSide = await deleteSide(req.params.sideId);
    res.send(deletedSide);
  } catch ({ name, message }) {
    next({ name, message });
  }
});
module.exports = sidesRouter