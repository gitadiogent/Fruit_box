const express = require("express");
const { sendContactEnquery } = require("../../utils/mail");
const router = express.Router();
const Details_Schema = require("../../modals/UserModals/Details");

router.post("/send/contact/enquiry/mail", async (req, res) => {
  const { customer_name, customer_email, message, customer_phone_number } =
    req.body;

  if (!customer_name || !customer_email || !message || !customer_phone_number) {
    res.status(400).send({ success: false, message: "Fill All the Field" });
  }

  try {
    const getAdminDetail = await Details_Schema.findOne({ user_type: "admin" });

    await sendContactEnquery(
      customer_name,
      customer_email,
      customer_phone_number,
      getAdminDetail?.order_notification_email,
      message
    );

    res.status(200).send({
      success: true,
      message: "Mail Send Successfull !!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Something Went Wrong" });
  }
});

module.exports = router;
