import dotenv from 'dotenv';
import express from "express";
import connectToDB from "./database/db.js"; 
import authRoutes from "./routes/auth-routes.js";
import homeRoutes from "./routes/home-routes.js";
import adminRoutes from "./routes/admin-routes.js";
import uploadImageRoutes from "./routes/image-routes.js";

dotenv.config();
connectToDB();

const app = express();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express.json());
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/image', uploadImageRoutes);

app.listen(PORT, () => {
    console.log(`Server is now listening to PORT: ${PORT}`);
});