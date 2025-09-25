import express from "express";
import Database from "./configs/db.js";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use((req, res, next) => {
    console.log(new Date(), req.method, req.url);
    next();
});

try {
    const dbInstance = Database.getInstance();
    await dbInstance.connect();
    app.listen(PORT, () => {
        console.log(`Server is running at port ${PORT}...`);
    });
} catch (error) {
    console.log('Server stop...', error);
}