const multer=require('multer');
const cors=require('cors');
const express= require('express');
const app=express();
app.use(cors());
app.use(express.json());
const mongoose = require('mongoose');
const UserModel = require('./models/user')
const AuthRouter= require('./routes/AuthRouter');
require('dotenv').config();

const PORT= process.env.PORT || 5050;

// Your MongoDB connection URL
const mongoURI = 'mongodb+srv://kukutlapallyrishith20:sunny2233@cluster0.yrwof.mongodb.net/user';

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Check for MongoDB connection errors
const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', () => {
  console.log('MongoDB connected successfully');
  // You can add any additional code you want to run after the connection is established here
});
//post
app.post('/register', async (req, res) => {
  const { name, email, phone, password } = req.body;
  
  // Check if all fields are filled
  if (!name || !email || !phone || !password) {
      return res.status(422).json({ error: "Please fill all fields" });
  }

  try {
      // Check if the user already exists by email
      const userExists = await UserModel.findOne({ email });
      if (userExists) {
          return res.status(422).json({ error: "User with this email already exists" });
      }

      // Create a new user
      const userModel = new UserModel({ name, email, phone, password });
      await userModel.save();
      
      // Respond with the saved user data
      res.status(200).json(userModel);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
  }
});



app.post('/login', async (req, res) => {
  const { name,email, password } = req.body;

  // Ensure email and password are provided
  if (!email || !password || !name ) {
      return res.status(422).json({ error: "Please provide both email and password" });
  }

  try {
      // Find the user by email
      const userExists = await UserModel.findOne({ email });

      if (!userExists) {
          return res.status(400).json({ message: "User not found" });
      }

      // Check if the password matches
      if (userExists.password !== password && userExists.name !==name) {
          return res.status(401).json({ message: "Incorrect password" });
      }

      // If email and password match
      res.status(200).json({ message: "Login successful", user: userExists });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
  }
});
app.use(cors());
app.use('/auth',AuthRouter);

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})



