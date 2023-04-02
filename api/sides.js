const express = require("express");
const sidesRouter = express.Router();

const { 
    createSide,
    getAllSides
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

module.exports = sidesRouter