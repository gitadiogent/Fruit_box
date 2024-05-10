const express = require("express");
const router = express.Router();
const Product_Controllers = require("../../controllers/web_controllers/Products_Controller");
const All_App_controllers = require("../../controllers/app_controllers/app_all_controller");

// Add a review to a product
router.post("/product/add-review/:productId", Product_Controllers.addReview);

// Delete a review from a product
router.delete(
  "/product/delete-review/:productId/:reviewId",
  Product_Controllers.deleteReview
);

// Edit a review for a product
router.put("/product/edit-review", Product_Controllers.editReview);

// all products routes
router.get("/all/products", Product_Controllers.getAllProducts);

router.get(
  "/get/single/product/by/product/name/:product_slug",
  Product_Controllers.getproductById
);
router.get("/filter/products", Product_Controllers.filterProducts);
router.post(
  "/filter/products/multi_category",
  Product_Controllers.multiCategory
);

router.post("/related_products", Product_Controllers.related_products);

router.get("/search/in/products", Product_Controllers.searchProducts);
router.patch("/edit/product/:product_id", Product_Controllers.editProduct);
router.patch(
  "/remove/product/image/:product_id/:product_image",
  Product_Controllers.deleteProductImage
);
router.patch(
  "/set/products/as/new/arrivals",
  Product_Controllers.setNewArrivalProducts
);
router.patch(
  "/remove/products/as/new/arrivals",
  Product_Controllers.removeNewArrivalProducts
);
router.patch(
  "/set/products/as/trending/products",
  Product_Controllers.setTrendingProducts
);
router.patch(
  "/remove/products/as/trending/products",
  Product_Controllers.removeTrendingProducts
);
router.post("/add/new/product", Product_Controllers.createProducts);
router.delete("/delete/product", Product_Controllers.deleteProducts);

router.get("/gethome", Product_Controllers.homeProducts);

router.get("/get/product/load/more", Product_Controllers.loadMoreProduct);

router.get("/get/product/category", Product_Controllers.productByCategory);

router.get(
  "/get/product/arrivals",
  All_App_controllers.getNewArrivalProductsForHome
);
router.get(
  "/get/product/arrivals/all",
  Product_Controllers.getAllNewArrivalProducts
);

router.get(
  "/get/product/trending/all",
  Product_Controllers.getAllTrendingProducts
);
router.get(
  "/get/product/trending",
  Product_Controllers.getAllTrendingProducts_web
);

router.post(
  "/app/cart/checkout/products/for/cash/on/delivery",
  All_App_controllers.cartCheckoutCod
); //done

router.post(
  "/calulate/price/for/razorpay/payment",
  All_App_controllers.calculatePrice
); //done

router.post(
  "/verify/payment/and/create/order/razorpay",

  All_App_controllers.verifyAndCreateOrder
);

module.exports = router;
