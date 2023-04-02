const express = require("express");
const dessertsRouter = express.Router();

const { 
    createDessert,
    getAllDesserts
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

module.exports = dessertsRouter