const mongoose = require("mongoose");
const Coupon_Schema = new mongoose.Schema(
  {
    coupon_code: { type: String },
    min_amount: { type: Number },
    expiry_date: { type: String },
    discount_type: { type: String },
    discount_value: { type: Number },
    description: { type: String },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", Coupon_Schema);
