const express = require("express");

const userController = require("../controller/user");
const router = express.Router();

router.post("/signup", userController.signUp);

router.post("/login", userController.login);

router.post("/sendmessage", userController.sendMessage);

router.get("/getmessages", userController.getMessages);

module.exports = router;
