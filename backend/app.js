var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./config");

// ========= Dashboard Routes ===========
const Details_Routes = require("./routes/users_routes/details_routes");
const Banners_Routes = require("./routes/users_routes/banners_routes");
const Website_Banners_Routes = require("./routes/users_routes/web_banners_routes");
const Category_Routes = require("./routes/users_routes/category_routes");
const Enquiry_Routes = require("./routes/users_routes/enquiry_routes");
const Orders_Routes = require("./routes/users_routes/order_routes");
const Customers_Routes = require("./routes/users_routes/customers_routes");
const Products_Routes = require("./routes/users_routes/products_routes");
const Otp_Routes = require("./routes/otp_routes");
const Wallet_Routes = require("./routes/users_routes/wallet_routes");
const Coupons = require("./routes/users_routes/coupons");

// ========= Dashboard Routes ===========

// ========= App Routes ===========
const App_All_Routes = require("./routes/app_routes/app_all_routes");
// ========= App Routes ===========

// ========= Web Routes ===========
const Web_Banners_Routes = require("./routes/web_routes/banners_routes");
const Web_Brands_Routes = require("./routes/web_routes/brands_routes");
const Web_Category_Routes = require("./routes/web_routes/category_routes");
const Web_Orders_Routes = require("./routes/web_routes/order_routes");
const Web_Products_Routes = require("./routes/web_routes/products_routes");
const Web_Users_Routes = require("./routes/web_routes/user_routes");
const Web_Webbanner_Routes = require("./routes/web_routes/Webbanner_routes");
const Web_Wholesale_Enquiry_Routes = require("./routes/web_routes/wholesale_enquiry_routes");
const web_detail_routes = require("./routes/web_routes/detail_routes");
const wallet_route = require("./routes/web_routes/WalletRoute");
const coupon_route = require("./routes/web_routes/couponRoute");
const contact_route = require("./routes/web_routes/contact_route");
const passport = require("passport");
const bulkInquiry = require("./routes/web_routes/bulkEnquiry");
const { default: helmet } = require("helmet");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
// ========= Web Routes ===========

var app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Working");
});

// ============ DASHBOARD ROUTES ===========
app.use("/api", Details_Routes);
app.use("/api", Banners_Routes);
app.use("/api", Website_Banners_Routes);
app.use("/api", Category_Routes);
app.use("/api", Enquiry_Routes);
app.use("/api", Orders_Routes);
app.use("/api", Customers_Routes);
app.use("/api", Products_Routes);
app.use("/api", Otp_Routes);
app.use("/api", Wallet_Routes);
app.use("/api", Coupons);
// ============ DASHBOARD ROUTES ===========

// ============ APP ROUTES ===========
app.use("/api", App_All_Routes);
// ============ APP ROUTES ===========

// =========== WEB ROUTES ============
app.use("/api/website/front", Web_Banners_Routes);
app.use("/api/website/front", Web_Brands_Routes);
app.use("/api/website/front", Web_Category_Routes);
app.use("/api/website/front", Web_Orders_Routes);
app.use("/api/website/front", Web_Products_Routes);
app.use("/api/website/front", Web_Users_Routes);
app.use("/api/website/front", Web_Webbanner_Routes);
app.use("/api/website/front", Web_Wholesale_Enquiry_Routes);
app.use("/api/website/front", web_detail_routes);
app.use("/api/website/front", wallet_route);
app.use("/api/website/front", coupon_route);
app.use("/api/website/front", contact_route);
app.use("/api/website/front", bulkInquiry);
// =========== WEB ROUTES ============

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log("Mongodb connected !!");
  })
  .catch((err) => {
    console.log(err, "Not connected to Mongodb !!");
  });

module.exports = app;
