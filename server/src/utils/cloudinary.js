import { v2 as cloudinary } from 'cloudinary';

/**
 * Uploads a file buffer from memory to Cloudinary
 * @param {Buffer} fileBuffer - The file buffer parsed by multer memoryStorage
 * @param {string} folder - The target directory in Cloudinary (defaults to Home/chat_app)
 * @returns {Promise<{url: string, publicId: string}>}
 */
export const uploadToCloudinary = (fileBuffer, folder = "chat_app") => {
    // Configure Cloudinary lazily at request runtime so process.env keys are loaded
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { resource_type: "auto", folder: folder },
            (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve({
                    url: result.secure_url,
                    publicId: result.public_id
                });
            }
        ).end(fileBuffer);
    });
};

/**
 * Deletes a file from Cloudinary using its public ID
 * @param {string} publicId - The public ID of the file to delete
 * @param {string} url - The file URL to help infer the resource type (image, video, raw)
 * @returns {Promise<any>}
 */
export const deleteFromCloudinary = (publicId, url = "") => {
    // Configure Cloudinary lazily at request runtime so process.env keys are loaded
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    let resourceType = "image";
    if (url) {
        if (url.includes("/video/upload/") || /\.(mp4|webm|ogg|mov|avi)$/i.test(url)) {
            resourceType = "video";
        } else if (url.includes("/raw/upload/") || /\.(pdf|docx|xlsx|zip|txt)$/i.test(url)) {
            resourceType = "raw";
        }
    }

    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, { resource_type: resourceType }, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });
    });
};
