
const User = require('../models/userSchema')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '7d' })
}

// login a user
const loginUser = async (req, res) => {
  const {email, password} = req.params

  try {
    const user = await User.login(email, password)

    // create a token
    const token = createToken(user._id)

    res.status(200).json({user,token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// signup a user
const signupUser = async (req, res) => {
  const {name,email,password,phone} = req.body

  try {
    
    const user = await User.signup(name , email, password , phone )

    // create a token
    const token = createToken(user._id)

    res.status(200).json({name,email, token,phone})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

//find a user by id 
const findUser = async (req, res) => {
  const userId = req.params.id ;
  try {
    const user = await User.findById(userId);
    
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error)
  }
}

//get all users 
const getUsers = async (req, res) => {
 
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json(error)
  }
}


module.exports = { signupUser, loginUser, findUser, getUsers  }