import express from "express";
import connectDB from "./backend/config/db.js";
import dotenv from "dotenv"
import userRoutes from "./backend/routes/userRoutes.js"
import postRoutes from "./backend/routes/postRoutes.js"
import { errorHandler, notFound } from "./backend/middleware/error.js";

dotenv.config()

const app = express();
app.use(express.json());


// Routes
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)

// Define a sample route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});


app.use(notFound)
app.use(errorHandler)

// Start the server
const port = process.env.PORT || 5000;
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`server is running on port ${port}`);
    })
})

export default app;