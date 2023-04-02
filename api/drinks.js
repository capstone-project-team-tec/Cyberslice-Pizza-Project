const express = require("express");
const drinksRouter = express.Router();

const { 
    createDrink,
    getAllDrinks
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

module.exports = drinksRouter