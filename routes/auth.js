const express = require("express");
const router = express.Router();

const {signup,login, deleteUser, listUser } = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);
router.post("/delete", deleteUser);
router.post("/", listUser);

module.exports = router;