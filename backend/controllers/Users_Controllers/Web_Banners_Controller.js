const Web_Banners_Schema = require("../../modals/UserModals/Web_Banners");
const Category_Schema = require("../../modals/UserModals/Category");

// get all banners
const getAllbanners = async (req, res) => {
  try {
    console.log("start");
    const findAll = await Web_Banners_Schema.find({}).sort({ createdAt: -1 });
    // category list for filter
    let findCategory = await Category_Schema.aggregate([
      { $group: { _id: "$main_category_name" } },
    ]).sort({ _id: 1 });
    console.log(findAll);
    // category list for filter
    res.status(200).json({ allbanners: findAll, category: findCategory });
  } catch (err) {
    console.log(err);
    res.status(500).send("something went wrong !!");
  }
};

// add new banners
const addNewBanner = async (req, res) => {
  console.log(req.body);
  try {
    const create = new Web_Banners_Schema({
      image_name: req.body?.image_name,
      image_url: req.body?.image_url,
      path: req.body?.path,
    });
    const result = await create.save();
    res.status(200).send({ status: true, message: "banner add success !!" });
  } catch (err) {
    console.log(err);
    res.status(500).send("something went wrong !!");
  }
};

// change banner
const changeBanner = async (req, res) => {
  const bannerId = req.params.banner_id;
  console.log(req.body, "bannerId", bannerId);
  try {
    if (!bannerId) {
      return res
        .status(404)
        .send({ status: false, message: "not found banner !!" });
    }
    const previousImage = await Web_Banners_Schema.findById(bannerId);
    if (!previousImage) {
      return res
        .status(404)
        .send({ status: false, message: "not found banner !!" });
    }
    const findBanner = await Web_Banners_Schema.findByIdAndUpdate(bannerId, {
      $set: req.body,
    });
    if (!findBanner) {
      return res
        .status(404)
        .send({ status: false, message: "not found banner !!" });
    }
    res.status(200).send({
      status: true,
      previous: previousImage,
      message: "Update banner success !!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("something went wrong !!");
  }
};

// link banner to category
const updateBannerLinkCategory = async (req, res) => {
  const bannerId = req.params.banner_id;
  console.log(bannerId, req.body);
  try {
    if (!bannerId) {
      return res
        .status(404)
        .send({ status: false, message: "not found banner !!" });
    }
    const checkBanner = await Web_Banners_Schema.findById(bannerId);
    if (!checkBanner) {
      return res
        .status(404)
        .send({ status: false, message: "not found banner !!" });
    }
    const findBanner = await Web_Banners_Schema.findByIdAndUpdate(bannerId, {
      $set: req.body,
    });
    if (!findBanner) {
      return res
        .status(404)
        .send({ status: false, message: "not found banner !!" });
    }
    res.status(200).send({ status: true, message: "Update banner success !!" });
  } catch (err) {
    console.log(err);
    res.status(500).send("something went wrong !!");
  }
};

// delete banner
const deleteBanner = async (req, res) => {
  const bannerId = req.params.banner_id;
  console.log("bannerId", bannerId);
  try {
    const findAndDelete = await Web_Banners_Schema.findByIdAndDelete(bannerId);
    res.status(200).send({ status: true, message: "banner delete success !!" });
  } catch (err) {
    console.log(err);
    res.status(500).send("something went wrong !!");
  }
};

exports.getAllbanners = getAllbanners;
exports.addNewBanner = addNewBanner;
exports.changeBanner = changeBanner;
exports.updateBannerLinkCategory = updateBannerLinkCategory;
exports.deleteBanner = deleteBanner;
