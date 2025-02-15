const express = require('express') 
const app = express()
require('dotenv').config();
require('./models/db');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')
const UserModel = require('./models/User')
const PORT = process.env.PORT || 5000;
app.use(bodyParser.json())
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.post('/signup', async (req, res) => {
   console.log("Data ");
  try{
    
  const {name,email,password}=req.body;
  console.log("Data ",name,email,password)
  const userModel = new UserModel({ name, email, password });
  userModel.password = await bcrypt.hash(password, 10);
  console.log("Data ",userModel);
  await userModel.save();
  res.status(201)
      .json({
          message: "Signup successfully",
          success: true
      })
} catch (err) {
  res.status(500)
      .json({
          message: "Internal server errror",
          success: false
      })
}

  })
  


app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`)
})
