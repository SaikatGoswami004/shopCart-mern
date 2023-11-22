const { genrateToken } = require("../config/jsonwebtoken");
const User = require("../model/user-model");
const asyncHandler = require("express-async-handler");
const { validateId } = require("../utils/validateId");
const { genrateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");

exports.createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    //create User
    const newUser = await User.create(req.body);
    return res.status(201).json(newUser);
  } else {
    //user already exist
    throw new Error("User Already Exits");
  }
});

exports.updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const updatedData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    mobile: req.body.mobile,
  };
  const updateUser = await User.findByIdAndUpdate(
    id,
    {
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      mobile: req?.body?.mobile,
    },
    {
      new: true,
    }
  );
  return res.status(201).json(updateUser);
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await genrateRefreshToken(findUser?._id);
    const updateUserToken = await User.findByIdAndUpdate(
      findUser?._id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    return res.json({
      id: findUser?._id,
      firstName: findUser?.firstName,
      lastName: findUser?.lastName,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: genrateToken(findUser?._id),
    });
  } else {
    throw new Error("invalid credential");
  }
});

exports.getAllUser = asyncHandler(async (req, res) => {
  try {
    const getUser = await User.find();
    return res.json(getUser);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
});

exports.getUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateId(id);
    const getUser = await User.findById(id);
    return res.json(getUser);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
});

exports.deleteUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateId(id);
    const getUser = await User.findByIdAndDelete(id);
    return res.json({ msg: "delete successfully!!" });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
});

exports.blockUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateId(id);
    const user = await User.findById(id);
    if (!user.isBlock) {
      const blockUser = await User.findByIdAndUpdate(
        user.id,
        {
          isBlock: true,
        },
        { new: true }
      );
      return res.json({ msg: "Block successfully!!" });
    }
    const unblock = await User.findByIdAndUpdate(
      user.id,
      {
        isBlock: false,
      },
      { new: true }
    );
    return res.json({ msg: "Unblock successfully!!" });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
});
exports.handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("no refresh token in cookie");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("No refresh token present or not match");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err && user?._id !== decoded.id) {
      throw new Error("There is something wrong with refreshToken");
    }
    const accessToken = genrateToken(user?._id);
    res.json(accessToken);
  });
});

//logout
exports.logOut = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("no refresh token in cookie");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", { httpOnly: true, secure: true });
    return res.json({ msg: "Logout Succesfully !!" });
  }
  await User.findByIdAndUpdate(user._id, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", { httpOnly: true, secure: true });
  return res.json({ msg: "Logout Succesfully !!" });
});
