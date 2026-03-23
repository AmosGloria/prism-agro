require("dotenv").config()
const app = require("./app");
const { connectDb } = require("./db/db");
const logger = require("./logs/logger");

const port = process.env.PORT || 3456;
connectDb()

app.listen(port, () =>{
    logger.info(`server is running on ${port} 🚀🚀🚀`)
});