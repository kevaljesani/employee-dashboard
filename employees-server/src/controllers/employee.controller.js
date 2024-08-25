import User from '../models/Employee.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
// import nodemailer from 'nodemailer'
import { CreateSuccess } from '../utils/success.js';
import { CreateError } from '../utils/error.js';
import { error } from 'console';
// import UserToken from '../models/UserToken.js';

import upload from '../middleware/audio-file-middleware.js';

export const createEmployee = async (req, res, next) => {
  try {
    upload.single('audioFile')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: err.message,
        });
      }

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
        audioFile: req.file ? req.file.filename : null // Save the filename if uploaded
      });

      const savedUser = await newUser.save();

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
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Duplicate key error',
        data: error.keyValue
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Validation error',
        data: error.errors
      });
    }

    return res.status(500).json({
      success: false,
      status: 500,
      message: error.message,
    });
  }
};

export const getAllEmployee = async (req, res) => {
  try {
    // Extract page and limit from query parameters, defaulting to 1 and 10
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Get the total count of documents
    const totalDocuments = await User.countDocuments();

    // Get the paginated data
    const userList = await User.find()
      .skip(skip)
      .limit(limit)
      .select('firstName lastName userName email gender salary city audioFile');

    // Send response with paginated data and pagination metadata
    return res.status(200).json({
      success: true,
      status: 200,
      data: userList,
      totalDocuments,
      currentPage: page,
      totalPages: Math.ceil(totalDocuments / limit),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: error.message,
    });
  }
};

export const updateEmployee = async(req,res)=>{
  const { id } = req.params;

  // Use multer middleware to handle file upload
  upload.single('audioFile')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: err.message,
      });
    }

    try {
      // Construct update object
      const updateFields = { ...req.body };

      // Handle file upload
      if (req.file) {
        // Delete old file if it exists
        const user = await User.findById(id);
        // if (user && user.audioFile) {
        //   const oldFilePath = path.join(uploadDir, user.audioFile);
        //   if (fs.existsSync(oldFilePath)) {
        //     fs.unlinkSync(oldFilePath);
        //   }
        // }

        // Add new file info to update object
        updateFields.audioFile = req.file.filename;
      }

      // Update document and get the updated document
      const updatedUser = await User.findOneAndUpdate(
        { _id: id },
        updateFields,
        { new: true, runValidators: true } // Return updated document and run validators
      );

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          status: 404,
          message: `User not found with ID ${id}`
        });
      }

      return res.status(200).json({
        success: true,
        status: 200,
        message: 'User details updated successfully!',
        user: updatedUser
      });

    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: 'Duplicate key error',
          data: error.keyValue
        });
      }

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          status: 400,
          message: 'Validation error',
          data: error.errors
        });
      }

      return res.status(500).json({
        success: false,
        status: 500,
        message: error.message,
      });
    }
  });
}

export const getEmployeeById = async(req,res)=>{
  const {id} = req.params;
  try {
    const user = await User.findById(id).select('firstName lastName userName email gender salary city audioFile');
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