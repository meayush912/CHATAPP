const asynchandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');

const registerUser = asynchandler(async (req, res) => {
    console.log(req);
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new error('enter all fields');
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new error('user already exists!');
    }

    const user = await User.create({
        name, email, password, pic
    });

    if (user) {

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            pic: user.pic,
            token: generateToken(user._id),
        });

    } else {
        res.status(400);
        throw new error('failed to create user :(');
    }
});


const authUser = asynchandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid Email or Password");
    }
});

const allUsers = asynchandler(async (req, res) => {
    // console.log(req.query);
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};
    console.log(req.user._id);

    const users = await User.find(keyword).find({ _id: { $ne: req.user.id } });
    // 
    res.send(users);
});


module.exports = { registerUser, authUser, allUsers };