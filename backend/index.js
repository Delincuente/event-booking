import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
    console.log(new Date(), req.method, req.url);
    next();
});

app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}...`);
});