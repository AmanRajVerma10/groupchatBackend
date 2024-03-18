const express = require("express");

const userController = require("../controller/user");
const router = express.Router();

router.post("/signup", userController.signUp);

router.post("/login", userController.login);

router.post("/sendmessage", userController.sendMessage);

router.get("/getmessages", userController.getMessages);

router.get("/allusers", userController.getUsers);
router.post("/invite", userController.inviteOthers);
router.post("/remove",userController.removeOthers);
router.post("/makeadmin",userController.makeAdmin);
router.post('/isadmin',userController.isAdmin);

router.post("/creategroup", userController.createGroup);
router.get("/getgroups", userController.getGroups);

module.exports = router;
