const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRouter = require("./routes/userRouter");
const problemRouter = require("./routes/problemRouter");
const aiRouter = require("./controllers/solveDoubt");
const videoRouter = require("./routes/videoCreator");
const submitRouter = require("./routes/submit");
const redisClient = require("./config/redis");
const main = require("./config/db");
require('dotenv').config(); // Load environment variables

const app = express();

app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/user", userRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);
app.use('/ai', aiRouter);
app.use("/video", videoRouter);

app.get("/", (req, res) => {
    res.send("Working")
});
const InitalizeConnection = async () => {
    try {
        await main();

        if (!redisClient.isOpen) {
            await redisClient.connect();
        }

        console.log('MongoDB and Redis Connected ✅');

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Startup Error ❌:', err);
    }
};

InitalizeConnection();
