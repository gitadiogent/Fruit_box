const express = require("express");
const router = express.Router();
const Order_Controllers = require("../../controllers/web_controllers/Order_Controller");
const App_controllers = require("../../controllers/app_controllers/app_all_controller")
const {
  cartCheckoutCod,
} = require("../../controllers/app_controllers/app_all_controller");

router.post("/create/new/order", Order_Controllers.createNewOrder);

router.post(
  "/create/new/order/from/website",
  Order_Controllers.cartCheckoutAndCreateOrder
);
router.get("/get/all/orders/", Order_Controllers.getAllOrders);

router.get(
  "/get/all/orders/user/:customer_id",
  Order_Controllers.getAllOrdersByUserId
);

router.get("/search/in/orders", Order_Controllers.searchInOrders);
router.get("/filter/by/orders", Order_Controllers.filterForOrders);
router.get("/get/order/by/id/:order_id", Order_Controllers.getOrderById);
router.patch("/change/order/status/:order_id", Order_Controllers.updateOrders);
router.delete("/delete/order/by/id", Order_Controllers.deleteOrders);
router.delete("/order/:id", Order_Controllers.deleteOrderById);

router.post("/cart/checkout/products/for/cash/on/delivery", cartCheckoutCod); //done

router.patch("/web/cancel/order/by/id/:order_id",App_controllers.cancelOrderById);//done

module.exports = router;
