var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/Restaurant", {

}).then(() => {
  console.log("Connected to MongoDB successfully");
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});

// Define User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

// Create User model
const User = mongoose.model('User', userSchema);

// Handle user sign up
app.post("/sign_up", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Create a new user instance
    const newUser = new User({
      name,
      email,
      password
    });
    // Save the user to the database
    await newUser.save();
    console.log("User Registered Successfully");
    return res.redirect('Signin.html');
  } catch (error) {
    console.error("Error signing up user:", error);
    return res.status(500).send("Internal Server Error");
  }
});

app.post("/sign_in", async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingEmail = await User.findOne({email});
        if(!existingEmail) {
            return res.send('<script>alert("Email does not exist !!"); window.location.href="/login";</script>')
        }
        const user = await User.findOne({ email, password });
        if (user) {
            res.redirect("/");
        } else {
            res.send('<script>alert("Invalid password"); window.location.href="/login";</script>');
        }
    } catch (error) {
        console.error(error);
        res.send('<script>alert("Login failed"); window.location.href="/login";</script>');
    }
});

// Redirect to index.html
app.get("/", (req, res) => {
  res.set({
    "Allow-acces-Allow-Origin": '*'
  });
  return res.redirect('index.html');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
