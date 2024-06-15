import express from "express";
import connectDB from "./backend/config/db.js";
import dotenv from "dotenv";
import userRoutes from "./backend/routes/userRoutes.js";
import postRoutes from "./backend/routes/postRoutes.js";
import emissionRoutes from "./backend/routes/emissionRoutes.js";
import goalRoutes from "./backend/routes/goalRoutes.js";
import foodRoutes from "./backend/routes/foodRoutes.js";
import adminRoutes from "./backend/routes/adminRoutes.js";
import companyRoutes from "./backend/routes/compnayRoutes.js";
import rewardRoutes from "./backend/routes/rewardRoutes.js";
import storyRoutes from "./backend/routes/storyRoutes.js";
import voucherRoutes from "./backend/routes/voucherRoutes.js";

import { errorHandler, notFound } from "./backend/middleware/error.js";
import cron from "node-cron";
import cors from "cors";
import { deleteOldStories } from "./backend/utils/croneOperations.js";
import corsOptions from "./backend/constants/corsOptions.js";

dotenv.config();

const app = express();
app.use(express.json());

// CORS middleware
app.use(cors(corsOptions));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/emission", emissionRoutes);
app.use("/api/rewards", rewardRoutes);
app.use("/api/story", storyRoutes);
app.use("/api/goal", goalRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/voucher", voucherRoutes);

// Define a sample route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use(notFound);
app.use(errorHandler);

// Start the server
const port = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`server is running on port ${port}`);
  });
});

// To run on 8PM every day
cron.schedule("0 20 * * *", function () {
  deleteOldStories();
});

export default app;
