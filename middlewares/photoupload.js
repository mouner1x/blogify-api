const path = require("path");
const multer = require("multer");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../img"));
    },
    filename: function (req, file, cb) {
        if (file) {
            cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
        } else {
            cb(null, false);
        }
    },
});



const photoupload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith("image")) {
            cb(null, true);
        } else {
            cb({ msg: "Unsupported File Format" }, false);
        }
    },
    limits: { fileSize: 1024 * 1024 * 2 },
});



module.exports={
    photoupload
}