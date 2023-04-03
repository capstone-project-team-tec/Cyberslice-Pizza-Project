const express = require("express");
const usersRouter = express.Router();

const { 
    createUser,
    getUserByUsername,
    getUserById,
    getAllUsers
    // deleteUser
} = require('../db/users');

//dependency imports
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
//function imports;
    
const { requireUser } = require('./utils');

usersRouter.use((req,res,next)=>{
    console.log("A request is being made to /users");
    next();
})
usersRouter.post('/login', async (req,res,next)=>{
    const {username,password} = req.body;
    if(!username || !password){
        next({
            name: "MissingCredentialsError",
            message: "Please supply both a username and password"
        });
    }
    try {
        console.log("Calling getUserByUsername in users.js, testing logging in");
        const user = await getUserByUsername(username);
        const userId = user.id;
        // if (userData.username && userData.password) {
        //     const userInDb = await fetchUserByUsername(userData.username);
            if (user) {
                const areTheyTheSame = await bcrypt.compare(password, user.password);
                if (areTheyTheSame) {
                    const token = await jwt.sign({username, password}, process.env.JWT_SECRET);
                    res.send(
                        {
                            success:true,
                            user:
                            {
                                userId,
                                username
                            },
                            message: "You are now logged in!",
                            token: token
                        }).status(200);
                } else {
                    res.send({message: "Wrong password!"}).status(403)
                }
            } else {
                res.send(
                    {
                        success: false,
                        error: {
                            name: "UserError",
                            message: "User does not exist. Please create a new account."
                        },
                        data: null
                    }).status(403);
            }
    } catch (error) {
        console.log(error);
        next(error);
    }
})
usersRouter.post('/register', async (req,res,next)=>{
    // const {username, password } = req.body;
    try {
        const userData = req.body;
        // const alreadyExists = await getUserByUsername(userData.username);|
        // if(alreadyExists){
        //     res.send({
        //         name: 'UserExistsError',
        //         message: 'A user by that username already exists'
        //     });
        // }
        if (userData.username && userData.password && userData.password.length >= 8 && userData.username.length >= 8) {
            // let newSaltValue = await bcrypt.genSalt(12)
            // console.log(userData.password);
            // let newHashedPassword = await bcrypt.hash(userData.password, newSaltValue)
            let newCreatedUser = await createUser({
                username: userData.username,
                password: userData.password,
                email: userData.email,
                address: userData.address,
                phone: userData.phone
            })
            // NORMALLY, you would also be generating a JWT on top of hashing the password, and sending that JWT with the response.send method.
            if (newCreatedUser) {
                const token = await jwt.sign({id: newCreatedUser.id, username: newCreatedUser.username},process.env.JWT_SECRET, {expiresIn: '1w'} );
                res.send(
                {
                    success: true,
                    error: null,
                    token: token,
                    message: "Thanks for signing up for our service."
                }).status(200)
            } else {
                res.send(
                    {
                        success: false,
                        error: {
                            name: "UserError",
                            message: "failed to create account"
                        },
                        data: null
                    }).status(403)
            }
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
})

usersRouter.get('/', async(req,res,next)=>{
    try {
        const users = await getAllUsers();
        res.send( users );
      } catch (error) {
        next(error);
      }
})

usersRouter.get('/me', requireUser, async(req,res,next)=>{
    try {
        const user = req.user;
        if (user){
            res.send({
                id: user.id,
                username: user.username
            });
        } else{
            res.send({
                success: false,
                error: {
                    name: 'user not found',
                    message: 'this user was not found in the system'
                },
                data: null
            })
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
})

// Just a boilerplate (GET BY ID) route; similar code from desserts.js
usersRouter.get('/:userId', async (req, res, next) => {
    const user = await getUserById(req.params.userId);
    if (!req.params.userId) {
      console.log(error);
      next(error);
    }
    try {
      res.send(
        user
      );
    } catch (error) {
      console.log(error);
      next(error);
    }
});

// Just a boilerplate; some similar code from desserts.js

// usersRouter.delete('/:userId', async (req, res, next) => {
//     if (!req.params.userId) {
//       console.log(error);
//       next(error);
//     }
//     try {
//       const deleteUser = await deleteUser(req.params.userId);
//       res.send(deletedUser);
//     } catch ({ name, message }) {
//       next({ name, message });
//     }
//   });

module.exports = usersRouter