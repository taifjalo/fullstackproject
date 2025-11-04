const express = require("express");
const database = require("../connect");
const ObjectId = require("mongodb").ObjectId;
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./config.env" });

//this labiry for Amazon (aws) storge to make new and get also delete subject (image) for our user and his habit.
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

let awsRoutes = express.Router();
// Let's add our database Alis bucket aws
const s3Bucket = "habitstorge";

// Let's connect our backend with S3Client function to the aws database storge
const s3Client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

//#1 - Retrive One, get Single image
//http://localhost:3000/images/12345
awsRoutes.route("/images/:id").get(verifyToken, async (request, response) => {
  const id = request.params.id;
  const bucketParams = {
    Bucket: s3Bucket,
    Key: id,
  };

  const data = await s3Client.send(new GetObjectCommand(bucketParams));

  // جميع المتغيرات التالية هي عبارة عن اتفاقية لاستخدام سلاسل
  // الرياكت كمصدر للصور الان بعد ان تم استدعاها من قاعدة(Jsx) قاعدة 64 في
  // البيانات , لان الصور تاتي على شكل رموز ليس صورة
  const contentType = data.ContentType;
  //First this Line takes the String (النص) then it turns it into base64 type String(يحوله لنوع النص)
  const srcString = await data.Body.transformToString("base64");
  const imageSource = `data:${contentType};base64,${srcString}`;
  response.json(imageSource);
});

/*
//#2 - Create new Single image
//http://localhost:3000/images/12345
awsRoutes.route("/images").post(verifyToken, async (request, response) => {
    const file = request.files[0]
    const bucketParams = {
        Bucket: s3Bucket,
        Key: file.originalname,
        Body: file.buffer
    }

    const data = await s3Client.send(new PutObjectCommand(bucketParams))
    console.log("Image upload response:", data);
    response.json(data)

}) */

//#2 - Create new Single image
//http://localhost:3000/habits/12345
awsRoutes.route("/images").post(verifyToken, async (request, response) => {
  try {
    console.log("Files received:", request.files); // Debug log

    if (!request.files || request.files.length === 0) {
      return response.status(400).json({ message: "No file uploaded" });
    }

    const file = request.files[0];
    console.log("Processing file:", file.originalname); // Debug log

    // Generate a unique ID or use original filename
    const imageId = `${Date.now()}_${file.originalname}`; // Better unique ID
    // OR use original filename: const imageId = file.originalname

    const bucketParams = {
      Bucket: s3Bucket,
      Key: imageId, // Use the imageId here
      Body: file.buffer,
    };

    const data = await s3Client.send(new PutObjectCommand(bucketParams));
    console.log("AWS upload successful, imageId:", imageId); // Debug log

    // Return the imageId that was used as the Key
    response.json({
      ...data,
      imageId: imageId, // Add this line to return the image ID
    });
  } catch (error) {
    console.error("Error uploading to AWS:", error);
    response
      .status(500)
      .json({ message: "Failed to upload image", error: error.message });
  }
});

//#3 - Delete Single image
// DELETE http://localhost:3000/images/:id
awsRoutes
  .route("/images/:id")
  .delete(verifyToken, async (request, response) => {
    const id = request.params.id;

    const bucketParams = {
      Bucket: s3Bucket,
      Key: id, // اسم الصورة داخل السحابة
    };

    try {
      const data = await s3Client.send(new DeleteObjectCommand(bucketParams));
      response.json({ message: "Image deleted successfully", data });
    } catch (error) {
      console.error("Error deleting image:", error);
      response
        .status(500)
        .json({ message: "Failed to delete image", error: error.message });
    }
  });

// تقوم الدالة باخذ رمز تاكيد جلسة مسجل الدخول ثم تضيفة
//  الى جميع المسارات لكي تعطي الاذن او التصريح
//  حتى يمكن للمستخدم استخدام المسارات
//  اي بمعنى الروءية والتعديل على معلوماتة الخ ت
function verifyToken(request, response, next) {
  const authHeader = request.headers["authorization"];

  // Format: "Bearer tokenvalue"
  const token = authHeader && authHeader.split(" ")[1];
  console.log(request);
  if (!token) {
    return response
      .status(401)
      .json({ message: "Token is missing or not provided" });
  }

  jwt.verify(token, process.env.SECRETKEY, (error, user) => {
    if (error) {
      return response.status(403).json({ message: "Invalid token" });
    }

    request.user = user;
    next();
  });
}

// Helper function to sanitize filenames
function sanitizeFilename(filename) {
  // Remove or replace special characters that might cause issues
  return filename
    .replace(/[äöåÄÖÅ]/g, (match) => {
      const replacements = {
        ä: "a",
        ö: "o",
        å: "a",
        Ä: "A",
        Ö: "O",
        Å: "A",
      };
      return replacements[match] || match;
    })
    .replace(/[^a-zA-Z0-9.-]/g, "_") // Replace other special chars with underscore
    .replace(/_+/g, "_") // Replace multiple underscores with single
    .replace(/^_|_$/g, ""); // Remove leading/trailing underscores
}

module.exports = awsRoutes;
