import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../config/sendEmail.js";

const singUp = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  try {
    if (!first_name || !last_name || !email || !password) {
      return res.status(409).json({
        success: false,
        message: "All fields required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exist",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      first_name,
      last_name,
      email,
      password: hashPassword,
    });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const isUser = await User.findOne({ email });
    if (!isUser) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentails",
      });
    }
    const isMatch = bcrypt.compare(password, isUser.password);
    if (!isMatch) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentails",
      });
    }
    const token = jwt.sign({ id: isUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const emailToken = jwt.sign({email:user.email},process.env.JWT_SECRET,{
        expiresIn:"5m"
    })

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${emailToken}`;

    const message=`
        <h1>Password reset request</h1>
        <p>Click the link below to reset your password. The link is valid for 5 minutes.</p>
        <a href="${resetUrl} target="_blank">Reset Password</a>
    `;

    await sendEmail(user.email,"Password Reset",message);
    res.status(200).json({
        success:true,
        message:"Password reset link send to email"
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const resetPassword = async (req, res) => {
  try {
    const { new_password, confirm_password } = req.body;
    const isUser = await User.findOne(req.user.email);
    if (!isUser) {
      return res.status(409).json({
        success: false,
        message: "User not found",
      });
    }

    if (new_password !== confirm_password) {
      return res.status(409).json({
        success: false,
        message: "New password and confirm Password are not match",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(new_password, salt);
    isUser.password = hashPassword;

    await isUser.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { singUp, login, getUserDetails, forgetPassword, resetPassword };
