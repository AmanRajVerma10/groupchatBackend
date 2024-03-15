const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../model/user");
const Message = require("../model/message");

function generateAccessToken(id, name) {
  return jwt.sign({ userId: id, name }, process.env.JWT_SECRETKEY);
}

exports.signUp = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    if (
      name.length === 0 ||
      email.length === 0 ||
      password.length === 0 ||
      phone.length === 0
    ) {
      return res.status(400).json({ err: "Bad params!" });
    }
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      throw new Error("Email already registered!");
    }

    bcrypt.hash(password, 10, async (err, hash) => {
      try {
        console.log(err);
        const data = await User.create({ name, email, phone, password: hash });
        res.status(201).json({ message: "Successfully signed up!" });
      } catch (e) {
        res.status(400).json(e);
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (email.length === 0 || password.length === 0) {
      return res.status(410).json({ message: "Invalid params!" });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    bcrypt.compare(password, user.password, (error, result) => {
      if (error) {
        return res
          .status(400)
          .json({ success: false, message: "Something went wrong" });
      }
      if (result === true) {
        return res.status(200).json({
          success: true,
          message: "Logged in!",
          token: generateAccessToken(user.id, user.name),
        });
      }
      if (result === false) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid password" });
      }
    });
  } catch (error) {
    res.status(404).json({ err: error.message });
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const { id, message } = req.body;
    const createMessage = await Message.create({ text: message, userId: id });
    if (!createMessage) {
      return res
        .status(400)
        .json({ success: false, message: "something went wrong" });
    }
    return res.status(200).json({ success: true, message: "message sent!" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const data = await Message.findAll();
    if (!data) {
      return res
        .status(400)
        .json({ success: false, message: "Something went wrong!" });
    }
    return res.status(200).json({ success: true, message: data });
  } catch (error) {
    res.status(401).json({ success: false, message: "Wrong" });
  }
};

exports.getUsers= async (req,res,next)=>{
  try {
    const data= await User.findAll();
    if (!data) {
      return res
        .status(400)
        .json({ success: false, message: "Something went wrong!" });
    }
    return res.status(200).json({success:true,users:data})
  } catch (error) {
    if (!data) {
      return res
        .status(402)
        .json({ success: false, message: "Something went wrong!" });
    }
    
  }
}