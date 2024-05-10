const mongoose = require("mongoose");
const Bulk_Inquiry = new mongoose.Schema(
  {
    product: {
      type: Object,
      required: true,
    },

    username: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    phone_number: {
      type: Number,
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bulk_Inquiry", Bulk_Inquiry);
