require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 5500;


app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));