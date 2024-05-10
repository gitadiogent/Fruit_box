const mongoose = require("mongoose");
const Products_Schema = new mongoose.Schema(
  {
    product_id: {
      type: String,
    },
    product_code: {
      type: String,
    },
    product_name: {
      type: String,
      required: true,
    },
    product_slug: {
      type: String,
      required: true,
    },
    product_variant: {
      type: String,
    },
    // product_gst:{
    //     type:Number
    // },
    product_regular_price: {
      type: Number,
      required: true,
    },
    product_sale_price: {
      type: Number,
      required: true,
    },
    new_arrival: {
      type: Boolean,
      default: false,
    },
    trending_product: {
      type: Boolean,
      default: false,
    },
    product_price: {
      type: Number,
    },
    color: [
      {
        type: String,
      },
    ],
    size: [
      {
        type: String,
      },
    ],
    weight: [
      {
        type: String,
      },
    ],
    is_variant_true: { type: Boolean, default: false },
    variant_option: [
      { option_name: { type: String }, option_values: [{ type: String }] },
    ],
    available_variants: [
      {
        product_regular_price: { type: Number },
        product_sale_price: { type: Number },
        product_variant_quantity: { type: Number },
        attributes: [{ type: String }],
      },
    ],
    cartoon_total_products: {
      type: Number,
    },
    product_quantity: {
      type: Number,
    },
    product_original_quantity: {
      type: Number,
    },
    product_tag: {
      type: String,
    },
    product_images: [
      {
        image_name: { type: String },
        image_url: { type: String },
        path: { type: String },
      },
    ],
    product_main_category: {
      type: String,
      required: true,
    },
    product_main_category_slug: {
      type: String,
      required: true,
    },
    product_category: {
      type: String,
      required: true,
    },
    product_category_slug: {
      type: String,
      required: true,
    },
    product_subcategory: {
      type: String,
      // required:true
    },
    product_subcategory_slug: {
      type: String,
      // required:true
    },
    product_description: {
      type: String,
    },
    product_description_website: {
      type: String,
    },
    product_review: [
      {
        user_id: { type: String },
        username: { type: String },
        rating: { type: String },
        created_at: { type: String },
        rating_description: { type: String },
      },
    ],

    meta_description: {
      type: String,
    },
    meta_title: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Products", Products_Schema);
