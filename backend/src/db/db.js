const mongoose = require("mongoose");
const logger = require("../logs/logger");

mongoose.set('strictQuery', false);
exports.connectDb = async () => {
    try {
        const dbconnect = await mongoose.connect(process.env.MONGO_URI);
        logger.info(`Mongodb connected: ${dbconnect.connection.host}`);
    } catch (error) {
        logger.error(`Error: ${error.message}`);
    }
}