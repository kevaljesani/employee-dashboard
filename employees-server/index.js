import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import employeeRoutes from './src/routes/employee.js';
import { CreateSuccess } from './src/utils/success.js';
import { CreateError } from './src/utils/error.js';
// import upload = ('./middleware/upload');
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
// import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// // Get __dirname equivalent in ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


// // Define the directory where files will be served from
// const uploadDir = path.join(__dirname, '../uploads');

// Middleware to serve static files
// app.use('/uploads', express.static(uploadDir));

app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

app.use('/api', employeeRoutes);

app.use(CreateError);
app.use(CreateSuccess);

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const success = [200, 201, 204].includes(statusCode);

  const response = {
    success: success,
    status: statusCode,
    message: err.message || "Something went wrong",
  };

  if (success && err.data) {
    response.data = err.data;
  }

  return res.status(statusCode).json(response);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
