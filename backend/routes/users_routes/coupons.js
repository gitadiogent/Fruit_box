const express = require("express");
const router = express.Router();
const Coupons = require("../../controllers/Users_Controllers/CouponsController");
const {
  usersCheckAuth,
  Frontend_Validator,
} = require("../../middlewares/adminCheckAuth");

router.get("/admin/get/coupon/:id", Frontend_Validator, Coupons.getCouponById);
router.get("/admin/get/all/coupons", Frontend_Validator, Coupons.getCouponData);

router.post("/admin/create/coupons", Frontend_Validator, Coupons.createCoupon);
router.post("/admin/update/coupons/:id", Frontend_Validator, Coupons.updateCoupon);

router.delete("/admin/delete/coupons/:id", Frontend_Validator, Coupons.deleteCoupon);

router.patch("/admin/change/status/coupons/:id", Frontend_Validator, Coupons.changeStatus);

module.exports = router;
