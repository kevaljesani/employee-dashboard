export const CreateError = (status,message,keyValue)=>{
    const error = new Error(message);
    error.status = status;
    if (keyValue) {
        error.message =   {keyValue,error:"duplicate key and value !!"};
    }
    return error;
}