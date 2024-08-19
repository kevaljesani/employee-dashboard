import User from '../models/Employee.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
// import nodemailer from 'nodemailer'
import { CreateSuccess } from '../utils/success.js';
import { CreateError } from '../utils/error.js';
import { error } from 'console';
// import UserToken from '../models/UserToken.js';


export const createEmployee = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
      email: req.body.email,
      password: hashPassword,
      gender: req.body.gender,
      salary: req.body.salary,
      city: req.body.city,
    });

    const savedUser = await newUser.save();

    // Send success response directly
    return res.status(200).json({
      success: true,
      status: 200,
      message: 'User Registered Successfully !!',
      data: {
        id: savedUser._id,
        email: savedUser.email,
        userName: savedUser.userName,
      },
    });

  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Duplicate key error',
        data: error.keyValue
      });
    }

    if (error.name === 'ValidationError') { // Mongoose validation error
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Validation error',
        data: error.errors
      });
    }

    // If other errors occur, send a 500 response
    return res.status(500).json({
      success: false,
      status: 500,
      message: error.message,
    });
  }
};

export const getAllEmployee = async(req,res) =>{
  try {
    const userList = await User.find().select('firstName lastName userName email gender salary city');
    return res.status(200).json({
      success:true,
      status:200,
      data:userList
    })

  } catch (error) {
    return res.status(500).json({
      success:false,
      status:500,
      message:error.message
    })
  }
}

export const updateEmployee = async(req,res)=>{
  const {id} = req.params;
  try {
    const updatedata = await User.findByIdAndUpdate(id,req.body);
    if(!updatedata){
      return res.status(404).json({
        success:false,
        status:400,
        message: `user is not find please to check id ${id}`
      })
    }
    const user = await User.findById(id).select('firstName lastName userName email gender salary city');
    return res.status(200).json({
      success:true,
      status:200,
      message:"User details are updated!!",
      user
    })
    
  } catch (error) {
    return res.status(500).json({
      success:false,
      status:500,
      message:error.message
    })
  }
}

export const getEmployeeById = async(req,res)=>{
  const {id} = req.params;
  try {
    const user = await User.findById(id).select('firstName lastName userName email gender salary city');
    if(!user){
      return res.status(404).json({
        success:false,
        status:400,
        message:`User is not find please to chceck the id ${id}`
      })
    }
    return res.status(200).json({
      success:true,
      status:200,
      user
    })
  } catch (error) {
    return res.status(500).json({
      status:500,
      success:false,
      message:error.message
    })
  }
}

export const deleteEmployee = async(req,res)=>{
  const {id} = req.params;
  try {
    const user = await User.findByIdAndDelete(id);

    if(!user){
      return res.status(404).json({
        success:false,
        status:400,
        message:`User is not find please to check the id ${id}`
      })
    }
    return res.status(200).json({
      success:true,
      status:200,
      message: `User is delete successfuly!! and id is ${id}`
    })
  } catch (error) {
    return res.status(500).json({
      success:false,
      status:500,
      message:error.message
    })
  }
}