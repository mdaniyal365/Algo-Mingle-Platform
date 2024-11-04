const express = require("express");
const { isLoggedIn } = require("../middlewares/user");
const { createARoom, isValidRoom } = require("../controller/interviewController");


const router = express.Router();

router.route('/createInterviewRoom').get( isLoggedIn , createARoom);
router.route('/checkInterviewId').get(isValidRoom);


module.exports = router;
