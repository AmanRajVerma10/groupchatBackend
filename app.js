const Sequelize=require('sequelize')
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./util/database");
const User = require("./model/user");
const Message= require("./model/message");
const Group= require("./model/group")
const userRoutes= require('./routes/user');

User.belongsToMany(Group, { through: 'UserGroup' });
Group.belongsToMany(User, { through: 'UserGroup' });
Message.belongsTo(Group);
Message.belongsTo(User);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ extended: false }));
app.use(
  cors({
    origin: "*",
  })
);

app.use('/user',userRoutes);

app.post('/groups/create', async (req, res) => {
  try {
    const group = await Group.create({ name: req.body.name, creatorId: req.body.creatorId });
    res.status(201).json({ group });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the group' });
  }
});

app.get('/groups', async (req, res) => {
  try {
    const groups = await Group.findAll();
    res.status(200).json({ groups });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching groups' });
  }
});


app.get('/user/getNewMessages', async (req, res) => {
  const lastMessageId = req.query.lastMessageId;
  try {
    const newMessages = await Message.findAll({ where: { id: { [Sequelize.Op.gt]: lastMessageId } } });
    res.json({ messages: newMessages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching new messages' });
  }
});

sequelize
  .sync()
  .then(() => {
    app.listen(4000);
  })
  .catch((e) => console.log(e));
