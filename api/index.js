const express = require('express');
const apiRouter = express.Router();

const jwt = require('jsonwebtoken');
const {getUserByUsername, getAdminUserByUsername} = require('../db');
require("dotenv").config()
const {JWT_SECRET} = process.env;

// Middleware that checks for a valid JSON Web Token in the header's Authroization field.
apiRouter.use(async(req,res,next)=>{
    // console.log("This is the top of the routeHandler");
    const prefix='Bearer ';
    const auth = req.header('Authorization');
    if(!auth){
        next();
    }else if(auth.startsWith(prefix)){
        console.log("TOP of else-if block");
        const token = auth.slice(prefix.length);
        // console.log(token);
        try {
            console.log("top of the try block");
            const jwtId = jwt.verify(token, JWT_SECRET);
            let admin = false
            const username = jwtId.username;
            if ("isAdmin" in jwtId) {
                admin = jwtId.isAdmin
            }
            console.log("This is the JWTid", jwtId);
            console.log("username: " +username);
            if(username && admin == false){
                console.log("top of the if statement in the try block");
                req.user = await getUserByUsername(username);
                console.log("Logging req.user" + req.user);
                next();
            } else {
                console.log("Started Admin")
                req.user = await getAdminUserByUsername(username);
                console.log("Finished admin")
                next()
            }
        } catch ({name, message}) {
            next({name, message});
        }
    }else{
        next({
            name: 'AuthorizationHeaderError',
            message: `Authorization token must start with ${prefix}`
        });
    }
});

// Middleware that checks if the the user was set.
apiRouter.use((req,res,next) =>{
    if(req.user){
        console.log("User is set: ",req.user);
    }
    next();
});

// Imported router objects.
const usersRouter = require('./users');
const dessertsRouter = require('./desserts');
const drinksRouter = require('./drinks');
const sidesRouter = require('./sides');
const pizzaRouter = require('./pizza');
const cartRouter = require('./cart');
const adminRouter = require('./admin');

// Mounting paths for the imported router objects.
apiRouter.use('/users', usersRouter);
apiRouter.use('/desserts', dessertsRouter);
apiRouter.use('/drinks', drinksRouter);
apiRouter.use('/sides', sidesRouter);
apiRouter.use('/pizza', pizzaRouter);
apiRouter.use('/cart', cartRouter);
apiRouter.use('/admin', adminRouter);

// Error handling middleware function.
apiRouter.use((error,req,res,next)=>{
    res.send({
        name: error.name,
        message: error.message
    });
});

module.exports = apiRouter;