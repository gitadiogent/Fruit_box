const express = require("express");
const router = express.Router();
const User_Controllers = require("../../controllers/web_controllers/User_Controller");
const passport = require("passport");

// users all routes
router.get("/user/get/alluser", User_Controllers.getAllUser);
router.get("/user/get/user", User_Controllers.getUserById);
router.get("/user/get/:user_id", User_Controllers.getUser);
router.post("/user/create/newuser", User_Controllers.createUser);

router.post("/user/create/newuser/web", User_Controllers.createUser_website);

router.post("/user/register", User_Controllers.registerUser);
router.post("/user/register_verify", User_Controllers.registerVerify);

router.post("/user/register_local_storage", User_Controllers.registerUserLocalStorage);
router.post("/user/register_verify_local_storage", User_Controllers.registerVerify);

router.post("/user/login_by_number", User_Controllers.loginUserByNumber);
router.post("/user/verify_login", User_Controllers.verifyOTPRegLog);

router.post("/user/login_by_number_local_storage", User_Controllers.loginUserByNumberLocalStorage);
router.post("/user/verify_login_local_storage", User_Controllers.verifyOTPRegLogLocalStorage);

router.post(
  "/user/verify_login/google",
  User_Controllers.verifyOTPRegLogGoogle
);

router.post(
  "/user/verify_login/google/single/api",
  User_Controllers.createUser_website_google_single
);

router.get("/user/loginUserData", User_Controllers.fetchLoginUserData);
router.post("/user/payment_add_reword", User_Controllers.makePaymentAddRewards);
router.post("/user/paymentVerifyRezor", User_Controllers.verifyPaymentRezor);
router.post(
  "/user/paymentVerifyRezorByReword",
  User_Controllers.verifyPaymentRezorByRewords
);
router.post("/user/deleteUsersById", User_Controllers.deleteUsersById);

router.post("/user/login", User_Controllers.loginUser);
router.get("/user/logout", User_Controllers.logoutUser);
router.patch("/user/edit/:user_id", User_Controllers.editUserByID);
router.delete("/delete/users", User_Controllers.deleteUsers);
router.get("/search/in/user", User_Controllers.searchInUsers);
router.get("/filter/users", User_Controllers.filterForUsers);

// router.get("/user/login/google/node", User_Controllers.googleLoginNodeJs);
router.get(
  "/user/login/google/node",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get("/user/login/google/node/callback", async (req, res) => {
  passport.authenticate("google", {
    successRedirect:
      "http://localhost:10000/api/website/front/user/login/google/node/callback/success",
    failureRedirect:
      "http://localhost:10000/api/website/front/user/login/google/node/callback/fail",
  });

  console.log(req.user);

  res.status(200).send("done");
});

router.get("/user/login/google/node/callback/success", async (req, res) => {
  console.log("User", req.user);

  res.send("success");
});
router.get("/user/login/google/node/callback/fail", async (req, res) => {
  res.status(400).json({
    success: false,
    message: "Something Went Wrong",
  });
});

module.exports = router;
