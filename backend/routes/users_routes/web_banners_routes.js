const express = require("express")
const router = express.Router();
const Banner_Controller = require("../../controllers/Users_Controllers/Web_Banners_Controller");
const {usersCheckAuth,Frontend_Validator,} = require("../../middlewares/adminCheckAuth")


router.get("/web/banner/get/all/banners",Frontend_Validator,usersCheckAuth,Banner_Controller.getAllbanners);
router.post('/web/banner/add/new/banner',Frontend_Validator,usersCheckAuth,Banner_Controller.addNewBanner);
router.patch("/web/banner/change/banner/by/id/:banner_id",Frontend_Validator,usersCheckAuth,Banner_Controller.changeBanner);
router.patch("/web/banner/link/banner/to/category/by/id/:banner_id",Frontend_Validator,usersCheckAuth,Banner_Controller.updateBannerLinkCategory);
router.patch("/web/banner/delete/banner/by/id/:banner_id",Frontend_Validator,usersCheckAuth,Banner_Controller.deleteBanner);

module.exports = router