const express = require("express");
const connectToMongoDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

connectToMongoDB();

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
