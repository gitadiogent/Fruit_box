const Detail_Schema = require("../../modals/UserModals/Details");

// get all banners
const getWebSiteData = async (req, res) => {
  try {
    const findAll = await Detail_Schema.findOne({}).select(
      "web_aboutus web_privacy_policy web_term_and_condition "
    );
    res.status(200).send({ webData: findAll, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).send("something went wrong !!");
  }
};

exports.getWebSiteData = getWebSiteData;
