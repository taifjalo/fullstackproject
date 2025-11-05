const connect = require("./connect");
const express = require("express");
const cors = require("cors");
const habits = require("./routes/habitRoutes");
const users = require("./routes/userRoutes");
const awsRoutes = require("./routes/awsRoutes");
const multer = require("multer");
const upload = multer();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(upload.any());
app.use(habits);
app.use(users);
app.use(awsRoutes);

connect
  .connectToServer()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
  });
