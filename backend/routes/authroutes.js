const express = require("express");
const router = express.Router();
const {
  registerUser,  registerAuthority,loginAuthority,loginUser} = require("../controllers/authcontrollers");

router.post("/user/register", registerUser);

router.post("/authority/register", registerAuthority);
router.post('/login/user', loginUser);
router.post('/login/authority', loginAuthority);


module.exports = router;
