// src/config/cloudinary.js — using cloudinary v1
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Property images storage
const propertyStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'dreamhomes/properties',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }],
  },
});

// Avatar storage
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'dreamhomes/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
  },
});

const uploadPropertyImages = multer({
  storage: propertyStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
}).array('images', 10);

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single('avatar');

const deleteImage = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};

module.exports = { cloudinary, uploadPropertyImages, uploadAvatar, deleteImage };
