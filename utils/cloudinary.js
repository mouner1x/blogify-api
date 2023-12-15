const cloudinary = require("cloudinary");
require("dotenv").config({path:"config.env"})

cloudinary.config({

cloud_name:process.env.cloud_name,
api_key:process.env.api_key,
api_secret:process.env.api_secret


})


async function cloudinaryUploadImage(imageFilename) {
    try {
        const data = await cloudinary.uploader.upload(imageFilename, {
            resource_type: "auto"
        });
        return data;
    } catch (error) {
        return error;
    }
}




async function cloudinaryRemoveImage(imagePublicId) {
    try {
        const result = await cloudinary.uploader.destroy(imagePublicId, {
            resource_type: "auto"
        });
        return result;
    } catch (error) {
        return error;
    }
}

module.exports = {
    cloudinaryUploadImage,
    cloudinaryRemoveImage
};






