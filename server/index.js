const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const productRoutes = require('./routes/productsRoutes');
const Product = require('./models/productsModel');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected')).catch(err => console.error(err));

app.use('/api', productRoutes);

// First i have written get function for it but with this it will get multiple times which is not needed in one call our data can be inserted
async function initializeDatabase() {
    try {
        const { data } = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');

        await Product.deleteMany({});
        await Product.insertMany(data);

    } catch (error) {
        console.error(error);
    }
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    initializeDatabase();
    console.log(`Server is running on port ${PORT}`);
});
