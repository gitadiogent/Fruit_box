const Coupons_Schema = require("../../modals/UserModals/Coupons");
const Utils = require("../../utils/Utils");

// get all enquiries
const allCoupons = async (req, res) => {
  try {
    let result = await Coupons_Schema.find({ status: true }).sort({
      createdAt: -1,
    });

    console.log("result =>>>>>>>>>>>>>>", result);

    let couponData = [];

    for (let coupon of result) {
      const today = new Date(Date.now());
      const couponDate = coupon.expiry_date;
      if (new Date(couponDate) > today) {
        couponData.push(coupon);
      }
    }

    res.status(200).send({
      coupons: couponData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("something went wrong !!");
  }
};

const getCouponData = async (req, res) => {
  const { by_status, date_from, date_to, recentDays } = req.query;
  const searchValue = req.query.search;
  const searchRegex = Utils.createRegex(searchValue);
  const limit = req.query.limit || 25;
  const page = req.query.page;
  let result;
  let getAllUserCount;

  console.log(page, limit, searchRegex, searchValue);

  try {
    //  =========== search for user ==========
    if (searchValue) {
      result = await Coupons_Schema.find({
        coupon_code: { $regex: searchRegex },
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit);
      getAllUserCount = await Coupons_Schema.find({
        coupon_code: { $regex: searchRegex },
      }).count();

      console.log(result);

      return res.status(200).json({
        alluser: result,
        user_count: getAllUserCount,
        pages: Math.ceil(getAllUserCount / limit),
      });
    }
    //  =========== search for user ==========

    // ===== filter for user ========
    // console.log("date====",Utils.convertDate(date_from),"-----",Utils.convertDate(date_to))
    const endDate = new Date(`${date_to}`);
    // seconds * minutes * hours * milliseconds = 1 day
    const dayTime = 60 * 60 * 24 * 1000;
    let increaseEndDateByOne = new Date(endDate.getTime() + dayTime);
    // console.log("INCREASED DATE",increaseEndDateByOne)

    // filter users by todays date and by their status
    let user_status;
    if (date_from && date_to && by_status) {
      if (by_status != "all") {
        user_status = by_status == "verified" ? true : false;
        result = await Coupons_Schema.aggregate([
          {
            $match: {
              verified: user_status,
              createdAt: {
                $lte: Utils.convertDate(increaseEndDateByOne),
                $gte: Utils.convertDate(date_from),
              },
            },
          },
          { $project: { password: 0 } },
          { $sort: { createdAt: -1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit },
        ]);
        getAllUserCount = await Coupons_Schema.aggregate([
          {
            $match: {
              verified: user_status,

              createdAt: {
                $lte: Utils.convertDate(increaseEndDateByOne),
                $gte: Utils.convertDate(date_from),
              },
            },
          },
          { $project: { password: 0 } },
          { $count: "user_count" },
        ]);
        console.log("getAllUserCount", getAllUserCount);
        return res.status(200).json({
          alluser: result,
          user_count: getAllUserCount[0]?.user_count,
          pages: Math.ceil(getAllUserCount[0]?.user_count / limit),
        });
      }
    } else {
      result = await Coupons_Schema.find(
        { verified: user_status },
        "-password"
      ).sort({ createdAt: -1 });
      // return res.status(200).send(result)
    }

    if (date_from && date_to) {
      result = await Coupons_Schema.aggregate([
        {
          $match: {
            createdAt: {
              $lte: Utils.convertDate(increaseEndDateByOne),
              $gte: Utils.convertDate(date_from),
            },
          },
        },
        { $project: { password: 0 } },
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
      ]);
      getAllUserCount = await Coupons_Schema.aggregate([
        {
          $match: {
            createdAt: {
              $lte: Utils.convertDate(increaseEndDateByOne),
              $gte: Utils.convertDate(date_from),
            },
          },
        },
        { $project: { password: 0 } },
        { $count: "user_count" },
      ]);
      // console.log("getAllUserCount----------",getAllUserCount)
      // console.log("getAllUserCount----------",getAllUserCount[0])
      return res.status(200).json({
        alluser: result,
        user_count: getAllUserCount[0]?.user_count,
        pages: Math.ceil(getAllUserCount[0]?.user_count / limit),
      });
    }
    if (by_status != "all") {
      let user_status = by_status === "verified" ? true : false;
      result = await Coupons_Schema.find({ verified: user_status }, "-password")
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit);
      getAllUserCount = await Coupons_Schema.find({
        verified: user_status,
      }).count();
      console.log("getAllUserCount", getAllUserCount);

      return res.status(200).json({
        alluser: result,
        user_count: getAllUserCount,
        pages: Math.ceil(getAllUserCount / limit),
      });
    }
    // ===== filter for user ========

    //===== all users ======
    result = await Coupons_Schema.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);
    getAllUserCount = await Coupons_Schema.find({}).count();
    console.log("getAllUserCount", getAllUserCount);

    res.status(200).json({
      alluser: result,
      user_count: getAllUserCount,
      pages: Math.ceil(getAllUserCount / limit),
    });
    //===== all users ======
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong !!");
  }
};

const getCouponById = async (req, res) => {
  const { id } = req.params;
  try {
    let result = await Coupons_Schema.findById(id);

    console.log("result =>>>>>>>>>>>>>>", result);

    res.status(200).send({
      coupon: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("something went wrong !!");
  }
};

const updateCoupon = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    let result = await Coupons_Schema.findById(id);

    if (!result) {
      return res.status(400).send({
        message: "Coupon Not Found",
      });
    }

    console.log("result =>>>>>>>>>>>>>>", result);

    const coupon = await Coupons_Schema.findByIdAndUpdate(id, {
      coupon_code: data.coupon_code_input,
      min_amount: data.minAmount,
      expiry_date: data.expDate,
      discount_type: data.discountType,
      discount_value: data.discountValue,
      description: data.description,
    });

    res.status(200).send({
      coupon: coupon,
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("something went wrong !!");
  }
};

const createCoupon = async (req, res) => {
  try {
    const data = req.body;

    console.log("new Data =>>>>>>>>>>>>>", data);

    let result = await Coupons_Schema.findOne({
      coupon_code: data.coupon_code_input,
    });

    if (result) {
      return res.status(400).send({
        message: "Coupne Already Exiest",
      });
    }

    const coupon = await Coupons_Schema.create({
      coupon_code: data.coupon_code_input,
      min_amount: data.minAmount,
      expiry_date: data.expDate,
      discount_type: data.discountType,
      discount_value: data.discountValue,
      description: data.description,
    });

    console.log("result =>>>>>>>>>>>>>>", result);

    res.status(200).send({
      coupons: coupon,
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("something went wrong !!");
  }
};

const deleteCoupon = async (req, res) => {
  const { id } = req.params;
  try {
    let result = await Coupons_Schema.findById(id);

    if (!result) {
      return res.status(400).send({
        message: "Coupon Not Found",
      });
    }

    await Coupons_Schema.findByIdAndDelete(id);

    res.status(200).send({
      message: "Coupon Deleted Successful",
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("something went wrong !!");
  }
};

const changeStatus = async (req, res) => {
  const { id } = req.params;
  try {
    let result = await Coupons_Schema.findById(id);

    if (!result) {
      return res.status(400).send({
        message: "Coupon Not Found",
      });
    }

    result.status = !result.status;

    await result.save();

    res.status(200).send({
      message: "Coupon Updated Successful",
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("something went wrong !!");
  }
};

exports.changeStatus = changeStatus;
exports.allCoupons = allCoupons;
exports.deleteCoupon = deleteCoupon;
exports.getCouponData = getCouponData;
exports.createCoupon = createCoupon;
exports.getCouponById = getCouponById;
exports.updateCoupon = updateCoupon;
