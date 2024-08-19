export  const CreateSuccess = (statusCode,statusMessage,data)=>{
    const successObj = {
        statusCode,
        statusMessage,
        data
    }
    return successObj;
}