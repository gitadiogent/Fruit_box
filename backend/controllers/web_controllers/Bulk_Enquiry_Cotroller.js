const Bulk_Inquiry = require("../../modals/UserModals/Bulk_Inquiry");
const Details_Schema = require("../../modals/UserModals/Details");
const { sendBulkEnquery } = require("../../utils/mail");

// create enquiries
const createBulkEnquires = async (req, res) => {
  const { username, phone_number, message, product, quantity } = req.body;
  try {
    if (!username || !phone_number || !message || !product) {
      return res.status(400).send({
        message: "Please fill All the Fields",
        success: false,
      });
    }

    const inquiry = Bulk_Inquiry.create({
      username,
      phone_number,
      quantity,
      message,
      product,
    });

    const getAdminDetail = await Details_Schema.findOne({ user_type: "admin" });

    await sendBulkEnquery(
      username,
      quantity,
      phone_number,
      message,
      product.product_code,
      getAdminDetail?.order_notification_email
    );

    res.status(200).send({
      message: "Inquiry Send Successfull",
      success: true,
      inquiry,
    });
    // res.status(200).send(findAll);
  } catch (err) {
    console.log(err);
    res.status(500).send("something went wrong !!");
  }
};

// get all enquiries
const getAllBulkEnquires = async (req, res) => {
  const limit = req.query.limit || 25;
  const page = req.query.page;
  let result;
  let count;
  try {
    result = await Bulk_Inquiry.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);
    console.log(result);
    count = await Bulk_Inquiry.find({}).count();
    res.status(200).send({
      all_enquiry: result,
      enquiry_count: count,
      pages: Math.ceil(count / limit),
    });
    // res.status(200).send(findAll);
  } catch (err) {
    console.log(err);
    res.status(500).send("something went wrong !!");
  }
};

// delete enquiry
const deleteBulkEnquiry = async (req, res) => {
  // console.log("body=>",req.body)
  // console.log("body=>",req.body?.length)
  try {
    if (req.body?.data?.length) {
      const deleteSelected = await Bulk_Inquiry.deleteMany({
        _id: {
          $in: req.body?.data,
        },
      });
      if (!deleteSelected) {
        return res
          .status(200)
          .send({ message: "enquiry delete failed", status: false });
      }
      return res
        .status(200)
        .send({ message: "enquiry delete success", status: true });
    }

    res.status(200).send({ message: "enquiry delete failed", status: false });
  } catch (err) {
    console.log(err);
    res.status(200).send({ message: "enquiry delete failed", status: false });
  }
};

exports.getAllBulkEnquires = getAllBulkEnquires;
exports.deleteBulkEnquiry = deleteBulkEnquiry;
exports.createBulkEnquires = createBulkEnquires;
