const express = require("express");
const router = express.Router();
const WalletController = require("../../controllers/Users_Controllers/Wallet_Controller");

router.post("/refer/coin/claim", WalletController.getReferClamim);

module.exports = router;
