const express = require("express");
const { signup , signin, signout, forgotPassword, resetPassword, getCurrentUser, resetPasswordCheck } = require("../controller/userController");
const { isLoggedIn } = require("../middlewares/user");
const router = express.Router();

router.route('/signup').post(signup);
router.route('/signin').post(signin);
router.route('/signout').get(signout);
router.route('/forgotpassword').post(forgotPassword);
router.route('/reset/check/:token').get(resetPasswordCheck);
router.route('/reset/password/:token').post(resetPassword);
router.route('/getCurrentUser').get(isLoggedIn ,getCurrentUser);





module.exports = router;