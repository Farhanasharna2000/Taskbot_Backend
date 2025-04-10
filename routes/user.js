const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Signin APIs
router.post("/sign-in", async (req, res) => {
  try {
    const { username, email } = req.body;

    const existingUser = await User.findOne({ username: username });
    const existingEmail = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exist" });
    } else if (username.length < 4) {
      return res
        .status(400)
        .json({ message: "Username should have atleast four characters" });
    }
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exist" });
    }
    const hashPass = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPass,
    });
    await newUser.save();
    return res.status(200).json({ message: "Signin successfully done" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Internal server error" });
  }
});

//login
router.post("/log-in", async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username: username });

  if (!existingUser) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  bcrypt.compare(password, existingUser.password, (err, isMatch) => {
    if (isMatch) {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        return res.status(500).json({ message: "Missing JWT secret" });
      }

      const token = jwt.sign(
        {
          name: username,
          id: existingUser._id,
        },
        secret,
        { expiresIn: "2d" }
      );

      res.status(200).json({ id: existingUser._id, token: token });
    } else {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
  });
});

module.exports = router;
