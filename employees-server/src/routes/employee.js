import express from 'express'
import {createEmployee ,getAllEmployee,updateEmployee,getEmployeeById,deleteEmployee} from '../controllers/employee.controller.js';
// import { verifyAdmin, verifyUser } from '../utils/verifyToken.js';
const router = express.Router();

// add employee
router.post('/create',createEmployee)

// get all employee
router.get('/employee-list',getAllEmployee)

// update employee details
router.put('/employee/:id',updateEmployee)

// // get by id
router.get('/employee/:id',getEmployeeById)

//delete by id
router.delete('/employee/:id',deleteEmployee)

export default router