const mongoose = require("mongoose")
const Web_Banners_Schema = new mongoose.Schema(
    {
        image_name:{type:String},
        image_url:{type:String},
        path:{type:String},
        selected_category:{type:String},

    },{timestamps:true}
)

module.exports = mongoose.model("Web_Banners",Web_Banners_Schema)
