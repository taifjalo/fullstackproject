const express = require("express");
const database = require("../connect");
const ObjectId = require("mongodb").ObjectId;
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./config.env" });

let habitRoutes = express.Router();

//#1 - Retrive All
//http://localhost:3000/habits
habitRoutes.route("/habits").get(verifyToken, async (request, response) => {
  let db = database.getDb();
  // author: request.user._id اجعل المستخدم يشوف فقط عاداته (مو كل العادات)
  // let data = await db.collection("habits").find({ author: request.user._id }).toArray();
  let data = await db.collection("habits").find({}).toArray();
  if (data.length > 0) {
    response.json(data);
  } else {
    throw new Error("Data was not found");
  }
});

//#2 - Retrive One
//http://localhost:3000/habits/12345
habitRoutes.route("/habits/:id").get(verifyToken, async (request, response) => {
  let db = database.getDb();
  let data = await db
    .collection("habits")
    .findOne({ _id: new ObjectId(request.params.id) });
  if (Object.keys(data).length > 0) {
    response.json(data);
  } else {
    throw new Error("Data was not found");
  }
});

//#3 - Create One
//http://localhost:3000/habits/12345
habitRoutes.route("/habits").post(verifyToken, async (request, response) => {
  let db = database.getDb();
  let mongoObject = {
    title: request.body.title,
    description: request.body.description,
    content: request.body.content,
    author: request.user._id,
    dateCreated: request.body.dateCreated,
    imageId: request.body.imageId,
  };
  let data = await db.collection("habits").insertOne(mongoObject);
  response.json(data);
});

//#4 - Update One
//http://localhost:3000/habits/12345
habitRoutes.route("/habits/:id").put(verifyToken, async (request, response) => {
  let db = database.getDb();
  let mongoObject = {
    $set: {
      title: request.body.title,
      description: request.body.description,
      content: request.body.content,
      author: request.body.author,
      dateCreated: request.body.dateCreated,
      imageId: request.body.imageId,
    },
  };
  let data = await db
    .collection("habits")
    .updateOne({ _id: new ObjectId(request.params.id) }, mongoObject);
  response.json(data);
});

//#5 - Delete One
//http://localhost:3000/habits/12345
habitRoutes
  .route("/habits/:id")
  .delete(verifyToken, async (request, response) => {
    let db = database.getDb();
    let data = await db
      .collection("habits")
      .deleteOne({ _id: new ObjectId(request.params.id) });
    response.json(data);
  });

// تقوم الدالة باخذ رمز تاكيد جلسة مسجل الدخول ثم تضيفة
//  الى جميع المسارات لكي تعطي الاذن او التصريح
//  حتى يمكن للمستخدم استخدام المسارات
//  اي بمعنى الروءية والتعديل على معلوماتة الخ ت
function verifyToken(request, response, next) {
  const authHeader = request.headers["authorization"];

  // Format: "Bearer tokenvalue"
  const token = authHeader && authHeader.split(" ")[1];

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

module.exports = habitRoutes;
