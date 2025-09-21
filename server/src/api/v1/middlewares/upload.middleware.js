const multer = require('multer');
const path = require('path');

// Set up the storage engine for Multer
const storage = multer.diskStorage({
    // The destination function tells Multer where to save the files.
    destination: (req, file, cb) => {
        // We save them in an 'uploads/' directory in the project root.
        // The 'null' means there is no error.
        cb(null, 'uploads/'); 
    },
    // The filename function tells Multer how to name the files.
    filename: (req, file, cb) => {
        // To prevent files with the same name from overwriting each other, we create a unique filename.
        // We use the original fieldname, the current timestamp, and the original file extension.
        // e.g., 'profilePic-1678886400000.png'
        const uniqueFilename = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueFilename);
    }
});

// Initialize the Multer upload middleware with our configuration.
const upload = multer({
    storage: storage,
    // Set file size limits to prevent very large uploads (e.g., 5MB).
    limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB
    // The fileFilter function allows us to control which file types are accepted.
    fileFilter: (req, file, cb) => {
        // We define the allowed file extensions using a regular expression.
        const allowedFiletypes = /jpeg|jpg|png|gif/;
        
        // Check both the file extension and the MIME type.
        const isMimeTypeAllowed = allowedFiletypes.test(file.mimetype);
        const isExtensionAllowed = allowedFiletypes.test(path.extname(file.originalname).toLowerCase());

        if (isMimeTypeAllowed && isExtensionAllowed) {
            // If the file type is allowed, pass 'true'.
            return cb(null, true);
        } else {
            // If not, reject the file with an error message.
            cb(new Error('File upload only supports JPEG, JPG, PNG, and GIF formats.'));
        }
    }
});

// IMPORTANT: Your previous code had `module.exports = upload;`.
// It's better practice to export it as an object property.
// This also prevents conflicts since your auth.middleware.js exports an object.
module.exports = { upload };
