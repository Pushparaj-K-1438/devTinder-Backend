const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/database');
const authRoutes = require('./src/routes/auth');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors({
    origin:'http://localhost:5173',
    credentials: true,
}));
app.use(cookieParser());

//access files from frontend
app.use("/uploads", express.static("uploads"));

app.use('/api/auth', authRoutes);
const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})