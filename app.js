const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./util/database");
const User = require("./model/user");
const Message= require("./model/message");
const userRoutes= require('./routes/user');

User.hasMany(Message);
Message.hasOne(User);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ extended: false }));
app.use(
  cors({
    origin: "*",
  })
);

app.use('/user',userRoutes);

sequelize
  .sync()
  .then(() => {
    app.listen(4000);
  })
  .catch((e) => console.log(e));
