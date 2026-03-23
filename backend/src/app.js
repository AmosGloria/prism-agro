const express = require("express");
const cors = require("cors");
// const userRoute = require("./auth/routes/routes");
// const notificationRoute = require("./notifications/routes/router");
// const adminRoute = require("./admin/routes/routes");

const app = express();

app.use(cors())

app.use(express.json());

// app.use("/api/v1/user", userRoute);
// app.use("/api/v1/notification", notificationRoute)
// app.use("/api/v1/admin", adminRoute)
// // app.use("/api/v1/auth", authRoute);
// // app.use("/api/v1/payment", paymentRouter);
// app.get('/', (req, res) => {
//       res.send('Hello World!')
//     })


module.exports = app