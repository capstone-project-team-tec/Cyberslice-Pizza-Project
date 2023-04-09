const express = require("express");
const usersRouter = express.Router();

const { 
    createUser,
    getUserByUsername,
    getUserById,
    getAllUsers,
    updateUser,
    deleteUser,
    createAdminUser,
    getAdminUser,
    getAdminUserByUsername

} = require('../db/users');

//dependency imports
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
//function imports;
    
const { requireUser, requireAdmin } = require('./utils');

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
        const userEmail = user.email
        const userRealName = user.name;
        const userAddress = user.address;
        const userPhone = user.phone;

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
                                username,
                                userId,
                                userEmail,
                                userRealName,
                                userAddress,
                                userPhone
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

usersRouter.post('/adminlogin', async (req,res,next) => {
    const {username, password} = req.body;

    if (!username || !password) {
        next({
            name: "MissingCredentialsError",
            message: "Please supply both a username and password"
        })
    }
    try {
        console.log("Calling getAdminUserByUsername in users.js, testing logging in")
        const user = await getAdminUserByUsername(username);
        const isAdmin = user.isAdmin
        if (user) {
            const areTheyTheSame = await bcrypt.compare(password, user.password);
            if (areTheyTheSame) {
                const token = await jwt.sign({username, password, isAdmin}, process.env.JWT_SECRET);
                res.send(
                    {
                        success:true,
                        user:
                        {
                            username,
                            isAdmin
                        },
                        message: "You are now logged in as admin!",
                        token: token
                    }).status(200);
                    } else {
                        res.send({message: "Wrong Password!"}).status(403)
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
    } catch(error) {
        console.log(error)
        next(error)
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
                name: userData.name,
                email: userData.email,
                address: userData.address,
                phone: userData.phone
            })
            // NORMALLY, you would also be generating a JWT on top of hashing the password, and sending that JWT with the response.send method.
            if (newCreatedUser) {
                console.log("This is the new created user...",newCreatedUser);
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
                user
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

usersRouter.get('/admin', requireAdmin, async(req, res, next)=> {
    try {
        const user = req.user;
        if (user){
            res.send({
                user
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

usersRouter.patch(`/me`, async (req, res, next) => {
    // const id = req.params.id
    console.log(req.user)
    const { id } = req.user
    const { username, name, email, address, phone} = req.body
    const updateFields = {}
    if(id) {
        updateFields.id = id
    }
    if (username) {
        updateFields.username = username
    }
    if (name) {
        updateFields.name = name
    }
    if (email) {
        updateFields.email = email
    }
    if (address) {
        updateFields.address = address
    }
    if (phone) {
        updateFields.phone = phone
    }
    try {
        const updatedUser = await updateUser(updateFields)
        console.log(updatedUser)
        res.send(updatedUser)
    } catch(error) {
        console.log(error)
    }
})

// Just a boilerplate; some similar code from desserts.js

usersRouter.delete('/me', async (req, res, next) => {
    // const { username } = req.user
    const { id } = req.user
    try {
    // const user = await getUserByUsername(username);
      if (!id) {
          res.send( {
              name: 'UserNotFoundError',
              message: 'Could not find a user with that username'
          } )
      } else { 
    // const { id } = req.user
        await deleteUser(id)
        res.send({
            success: true,
            message: "User was successfully deleted"
        })
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  });


module.exports = usersRouter


