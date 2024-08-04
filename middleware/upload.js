const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/cache/");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + file.originalname.split(' ').join(''));
    },
});

const upload = multer({ storage });



module.exports = {
    upload
};