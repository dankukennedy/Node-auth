import User from "../model/User.js"
import  bcrypt from 'bcryptjs'
import  jwt from 'jsonwebtoken'

//register controller
export const registerUser = async (req,res)=>{
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
export const loginUser = async (req,res)=>{
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


  export const changePassword = async(req, res)=>{
     try {
       const userId =  req.userInfo.userId
       //extract old and new password
       const {oldPassword, newPassword} = req.body

        //find  the current logged in user
        const user = await User.findById(userId);

        if(!user){
          res.status(400).json({success:false, message:'user not found'})
        }

        //check if the old password matches
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

        if(!isPasswordMatch){
          res.status(400).json({success:false, message:'old password is not correct please try again'})
        }

        //hash the new password there
        const salt = await bcrypt.genSalt(10)
        const newHashedPassword = await bcrypt.hash(newPassword, salt)

        user.password = newHashedPassword
        await user.save();

        res.status(200).json({success:true,message:'Password Change Successfully'})

      } catch (error) {
      console.log(error);
      res.status(500).json({success:false, message:'Something Went wrong  Please try again'});
     }
  }

  export const updateUserDetails = async(req,res)=>{
     try {
      const userId =  req.userInfo.userId;

      const {username,email,bio,contact} =  req.body;
        
          if(!username|| !email || !bio){
            res.status(400).json({success:false, message:'username, email and Bio cannot be left empty'})
          }
       //find  the current logged in user
       const user = await User.findById(userId);

       if(!user){
        res.status(400).json({success:false, message:'user not found'})
      }
           const updateUser = await User.findByIdAndUpdate(userId, {email,username,contact,bio},{new:true},{runValidators:true})
            //await user.save();
            res.status(200).json({success: true,message: 'User details updated successfully',user: updateUser});
     } catch (error) {
      console.log(error);
      res.status(500).json({success:false, message:'Something Went wrong  Please try again'});
     }
  }


  export const deleteUser = async(req,res)=>{
    try {
      const userId =  req.userInfo.userId;
      const userToDeleteId =  req.params.id
      //check if the userId is present in the request
      if(!userId){
         res.status(400).json({success:false, message:'authorize user not found'})
      }
      //find  the current logged in user
       const user = await User.findById(userId);
        if(!user){
        res.status(400).json({success:false, message:'user not found'})
      }
      //check if the user is admin or not
      if(user.role !=="admin"){
        res.status(403).json({success:false, message:'Access Denied! Admin right required'})
      }
      //check if the user to be deleted is present or not
      if(!userToDeleteId){
          res.status(400).json({success:false, message:'user ID not found to be deleted'})
      }
      //preventing admin from deleting themselves
      if(userToDeleteId === user){
        res.status(400).json({success:false, message:"Admins cannot delete themselves"})
      }
      //find the user to be deleted
      const deletedUser = await User.findByIdAndDelete(userToDeleteId)
          res.status(200).json({success: true,message: 'User deleted successfully', deletedUser});
    }catch(error){
       console.log(error);
      res.status(500).json({success:false, message:'Something Went wrong  Please try again'});
     }

  }

  export const findAllUsers = async(req,res)=>{
    try {
     const userId =  req.userInfo.userId;
      //check if the userId is present in the request 
      if(!userId){
         res.status(400).json({success:false, message:'authorize user not found'})
      }
      //find  the current logged in user
       const user = await User.findById(userId);
        if(!user){
        res.status(400).json({success:false, message:'user not found'})
        }
      //check if the user is admin or not
      if(user.role !=="admin"){
        res.status(403).json({success:false, message:'Access Denied! Admin right required'})
      } 
      //find all users
      const allUsers = await User.find({}).select('-password -__v').sort({createdAt: -1});
      if(allUsers.length === 0){
        return res.status(404).json({success:false, message:'No users found'});
      } 
      res.status(200).json({success: true, message: 'All users fetched successfully', users: allUsers});
    } catch (error) {
      console.log(error);
      res.status(500).json({success:false, message:'Something Went wrong  Please try again'});
    }
  }