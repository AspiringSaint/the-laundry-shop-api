require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 5500;

const connectDatabase = require('./configurations/db.connection');
const errorHandler = require('./middlewares/error.middleware');

connectDatabase();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use(errorHandler);

mongoose.connection.once('open', () => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
});