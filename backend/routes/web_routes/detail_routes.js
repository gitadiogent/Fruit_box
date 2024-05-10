const express = require("express");
const router = express.Router();
const Detail_Controllers = require("../../controllers/web_controllers/Detail_Controllers");

// users all routes
router.get("/web/get/web/data", Detail_Controllers.getWebSiteData);

module.exports = router;
