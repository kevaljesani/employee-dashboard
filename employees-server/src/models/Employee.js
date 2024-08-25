import mongoose,{Schema} from "mongoose";
import { type } from "os";

const EmployeeSchema = mongoose.Schema({

    firstName:{
        type:String,
        require:true
    },
    lastName:{
        type:String,
        require:true
    },
    userName:{
       type:String,
       require:true,
       unique:true 
    },
    email:{
      type:String,
      require:true,
      unique:true  
    },
    password:{
        type:String,
        require:true,
    },
    gender:{
        type:String,
        require:true,
        enum: ['Male', 'Female', 'Other'] 
    },
    salary:{
        type:Number,
        require:true
    },
    city:{
        type:String,
        require:true
    },
    audioFile: {
        type: String, // Store the filename or file path
        required: false
      }
 
},
    {
        timestamps:true
    }
)


export default mongoose.model("Employee",EmployeeSchema)