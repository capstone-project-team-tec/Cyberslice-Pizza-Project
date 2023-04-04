const express = require("express");
const pizzaRouter = express.Router();

const { 
    addToppingsToPizza,
    fetchPizzaWithToppingsInfo,
    createPizza,
    addDetailsToPizza,
    fetchPizzaByName
} = require('../db/pizza');

//dependency imports
require('dotenv').config();
// Do we even need this?
// const jwt = require('jsonwebtoken');
// const bcrypt = require("bcrypt");

// const { requireUser } = require('./utils');

pizzaRouter.use((req,res,next)=>{
  console.log("A request is being made to /pizza");
  next();
})

pizzaRouter.get('/', async (req, res, next) => {
  console.log('the pizza router get function is running......' + req.body.name)
  if (req.body.name) {
    console.log("the pizza router is running....")
    try {
      console.log('a name has been found!!!!!')
      const name = req.body.name;
      const singlePizza = await fetchPizzaByName(name);
      console.log("this is singlePizza" + singlePizza);
      res.send(singlePizza);
    } catch (error) {
      console.log(error);
    }
  } else {
    res.status(400).send({ 
      query: JSON.stringify(req.body.name),
      message: "The name parameter is missing" });
  }
});

pizzaRouter.post('/', async (req, res, next) => {
  try {
    let newPizza = await createPizza();
    if (newPizza) {
      res.send(
        {
          success: true,
          error: null,
          message: "A new row has been created in pizza table"
        }).status(200)
    } else {
      res.send(
        {
            success: false,
            error: {
                name: "createPizzaError",
                message: "Failed to create a new row in pizza table"
            },
            data: null
        }
      ).status(403)
    }
  } catch (error) {
      console.log(error);
      next(error);
  }
})

pizzaRouter.patch('/:pizzaId', async (req, res, next) => {
  const id = req.params.pizzaId;
  console.log("pizzaRouter.patch; pizzaId: " + id);
  const { name, basePizzaCost, size } = req.body;

  console.log("this is line 57" + name);
  console.log("this is line 58" + basePizzaCost);
  console.log("this is line 59" + size);

  const updateFields = {};

  if (name) {
    updateFields.name = name;
  }

  if (basePizzaCost) {
    updateFields.basePizzaCost = basePizzaCost;
  }

  if (size) {
    updateFields.size = size;
  } 

  try {
    const updatePizza = await addDetailsToPizza(id, updateFields);
    res.send(updatePizza);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = pizzaRouter