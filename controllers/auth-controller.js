const User = require("../model/User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//register controller
const registerUser = async (req,res)=>{
  try {
       //extract user information from request body
       const {username, email, password, contact, bio, role} = req.body;
       // Validate required fields
    if (!username || !email || !password || !contact) {
        return res.status(400).json({
          success: false,
          message: "Username, email, password, and contact are required fields"
        });
      }
       
       //check if the user is already exists in the database
       const checkExistingUser = await User.findOne({$or :[{username},{email},{contact}]});
       if(checkExistingUser){
        return res.status(400).json({success:false, message:"User is already exists with same username or email or contact Please try with with different username or email or contact"})
       }

      //hash user password
       const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(password, salt);

     //create a new user and save in the database
     const newlyCreatedUser = new User({
        username,
        email,
        contact,
        bio,
        password :hashedPassword,
        role : role || 'user'
     })

     await newlyCreatedUser.save()

     if(newlyCreatedUser){
        res.status(201).json({success:true, message:'User registered successfully',newlyCreatedUser})
     } else {
        res.status(400).json({success:false, message:'unable to register User please try again later'});
     }
  } catch (error) {
    console.log(error);
    res.status(500).json({success:false, message:'Something Went wrong  Please try again'});
  }
}

//login controller
const loginUser = async (req,res)=>{
    try {
      const {username, password } = req.body
      //find the current user exists in the database or not
      const user = await User.findOne({username})
      if(!user){
        return res.status(400).json({success:false, message:'Invalid credential'})
      }

      //if the password matches
      const isPasswordMatch =  await bcrypt.compare(password,user.password)
      if(!isPasswordMatch){
        return res.status(400).json({success:false, message:'Invalid credential'})
      }

      //create user token
    const accessToken = jwt.sign({
        userId: user._id,
        username: user.username,
        role:user.role,
     }, process.env.JWT_SECRET_KEY, {
       expiresIn:'30m'
     })

     res.status(200).json({success:true, message:'Logged in successful', accessToken})

    } catch (error) {
      console.log(error);
      res.status(500).json({success:false, message:'Something Went wrong  Please try again'});
    }
  }
  

  module.exports = { loginUser, registerUser}