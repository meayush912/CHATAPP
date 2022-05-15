const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const userModel = mongoose.Schema({
    name: { type: String, requires: true },
    email: { type: String, requires: true, unique: true },
    password: { type: String, required: true },
    pic: {
        type: String, default: "https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/in/wp-content/uploads/2022/03/monkey-g412399084_1280.jpg",
    },
}, {
    timestamps: true,
});

userModel.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userModel.pre("save", async function (next) {
    if (!this.isModified) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userModel);
module.exports = User;