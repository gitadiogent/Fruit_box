const express = require("express");
const router = express.Router();

const {
  getCouponBycouponCode,
} = require("../../controllers/app_controllers/app_all_controller");
const {
  allCoupons,
} = require("../../controllers/Users_Controllers/CouponsController");

router.get("/get/coupons/code/:title/:total", getCouponBycouponCode);
router.get("/app/get/coupons", allCoupons);

module.exports = router;
