const mongoose = require("mongoose");
require('dotenv/config');

const connectDB = async () => {
    console.log(process.env.PORT);
    try {
        const uri = process.env.MONGO_URI;
        const conn = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit();
    }
};

module.exports = connectDB;