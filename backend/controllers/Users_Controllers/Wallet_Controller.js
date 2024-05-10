const Customer_Schema = require("../../modals/UserModals/Customers");
const Details_Schema = require("../../modals/UserModals/Details");

// get all enquiries
const getwalletData = async (req, res) => {
  try {
    let result = await Details_Schema.findOne();

    // console.log("result =>>>>>>>>>>>>>>", result);

    res.status(200).send({
      wallet_data: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("something went wrong !!");
  }
};

const updateWalletData = async (req, res) => {
  try {
    const { coinPrice, perReferAmount, min_amount_wallet_use, walletStatus, rangeArrya } = req.body;

    // console.log("min_amount_wallet_use", min_amount_wallet_use);

    let result = await Details_Schema.findOne();

    console.log("result", result);

    result.one_coin_price = coinPrice;
    result.coins_per_refer = perReferAmount;
    result.min_amount_wallet_use = Number(min_amount_wallet_use);
    result.is_wallet_active = walletStatus;
    result.coin_gift_range = rangeArrya;

    await result.save();

    res.status(200).send({
      message: "Updated Successful",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("something went wrong !!");
  }
};

const getReferClamim = async (req, res) => {
  try {
    console.log("full body", req.body);

    const body = req.body;

    if (!body.refer_id) {
      return res.status(203).send({
        success: false,
        message: "Invalid Refer Id !!",
      });
    }

    const currentUser = await Customer_Schema.findOne({
      user_refer_id: body.userData.user_refer_id,
    });

    const referedUser = await Customer_Schema.findOne({
      user_refer_id: body.refer_id.trim(),
    });

    console.log("currentUser", currentUser);
    console.log("referedUser", referedUser);
    if (!currentUser || !referedUser) {
      return res.status(203).send({
        success: false,
        message: "Invalid Refer Id !!",
      });
    }

    if (currentUser.isReferClamed) {
      return res.status(200).send({
        success: false,
        message: "Already Claimed !!",
      });
    }

    const findUser = await Details_Schema.findOne({});

    console.log(findUser);

    currentUser.wallet += findUser.coins_per_refer;
    referedUser.wallet += findUser.coins_per_refer;

    currentUser.isReferClamed = true;

    await currentUser.save();
    await referedUser.save();

    res.status(200).send({
      message: "Refer Claimed",
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("something went wrong !!");
  }
};

exports.getReferClamim = getReferClamim;
exports.getwalletData = getwalletData;
exports.updateWalletData = updateWalletData;
