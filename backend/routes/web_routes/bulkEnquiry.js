const express = require("express");
const router = express.Router();
const {
  getAllBulkEnquires,
  deleteBulkEnquiry,
  createBulkEnquires,
} = require("../../controllers/web_controllers/Bulk_Enquiry_Cotroller");

router.post("/create/bulk/inquiry", createBulkEnquires);

router.get("/get/all/bulk/inquiry", getAllBulkEnquires);

router.post("/get/delete/bulk/inquiry", deleteBulkEnquiry);

module.exports = router;
