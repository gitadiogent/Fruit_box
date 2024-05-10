const express = require("express")
const router = express.Router();
const Wallet_Controller = require("../../controllers/Users_Controllers/Wallet_Controller")

const {Frontend_Validator, App_Validator,} = require("../../middlewares/adminCheckAuth")


router.get("/admin/get/wallet/data",Wallet_Controller.getwalletData);

router.post("/admin/update/wallet/data",Frontend_Validator,Wallet_Controller.updateWalletData);
router.post("/refer/coin/claim",App_Validator,Wallet_Controller.getReferClamim);

module.exports = router