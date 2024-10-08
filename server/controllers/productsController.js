const axios = require('axios');
const Product = require('../models/productsModel');

// Listing all the Transactions
exports.listTransactions = async (req, res) => {
    try {
        const { search = '', page = 1, perPage = 10, month = 3 } = req.query;

        // Create the base query object
        const query = {
            $expr: { $eq: [{ $month: "$dateOfSale" }, Number(month)] }, // Filter for month
            $or: [
                { title: new RegExp(search, 'i') },            // Search in title
                { description: new RegExp(search, 'i') },      // Search in description
            ]
        };
        // Check for price
        if (!isNaN(search)) {
            query.$or.push({ price: Number(search) });
        }

        //  Finding Product with Pagination
        const transactions = await Product.find(query)
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage));

        const total = await Product.countDocuments(query);

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transactions', error });
    }
};

// Get the statistic by month
exports.getStatistics = async (req, res) => {
    try {
        const { month = 3 } = req.query; // Default month is March

        const totalSaleAmount = await Product.aggregate([
            {
                $match: {
                    $expr: { $eq: [{ $month: "$dateOfSale" }, Number(month)] } // Match month regardless of year
                }
            },
            { $group: { _id: null, total: { $sum: '$price' } } }
        ]);

        const soldItems = await Product.countDocuments({
            $expr: { $eq: [{ $month: "$dateOfSale" }, Number(month)] }, // Match month regardless of year
            sold: true
        });

        const notSoldItems = await Product.countDocuments({
            $expr: { $eq: [{ $month: "$dateOfSale" }, Number(month)] }, // Match month regardless of year
            sold: false
        });

        res.status(200).json({
            totalSaleAmount: totalSaleAmount[0]?.total || 0,
            soldItems,
            notSoldItems
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching statistics', error });
    }
};

// Get the data for bar Chart
exports.getBarChart = async (req, res) => {
    try {
        const { month = 3 } = req.query; // Default month is March

        // Define all the ranges
        const ranges = [
            { range: '0-100', min: 0, max: 100 },
            { range: '101-200', min: 101, max: 200 },
            { range: '201-300', min: 201, max: 300 },
            { range: '301-400', min: 301, max: 400 },
            { range: '401-500', min: 401, max: 500 },
            { range: '501-600', min: 501, max: 600 },
            { range: '601-700', min: 601, max: 700 },
            { range: '701-800', min: 701, max: 800 },
            { range: '801-900', min: 801, max: 900 },
            { range: '901-above', min: 901, max: Infinity }
        ];

        // Fetch count for each price range
        const results = await Promise.all(ranges.map(async (r) => {
            const count = await Product.countDocuments({
                $expr: { $eq: [{ $month: "$dateOfSale" }, Number(month)] }, // Match month regardless of year
                price: { $gte: r.min, $lt: r.max }
            });
            return { range: r.range, count };
        }));

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bar chart data', error });
    }
};

// Get the data for Pie Chart
exports.getPieChart = async (req, res) => {
    try {
        const { month = 3 } = req.query; // Default month is March

        const categories = await Product.aggregate([
            {
                $match: {
                    $expr: { $eq: [{ $month: "$dateOfSale" }, Number(month)] } // Match month regardless of year
                }
            },
            {
                $group: {
                    _id: '$category',   // Group by category
                    count: { $sum: 1 }  // Count the number of items in each category
                }
            }
        ]);

        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pie chart data', error });
    }
};

// API which fetches the data from all the 3 APIs mentioned above, combines the response and sends a final response of the combined JSON
exports.getCombinedData = async (req, res) => {
    try {
        // Use Promise.all to fetch all data concurrently
        const { month = 3 } = req.query;
        const [statistics, barChart, pieChart, transactions] = await Promise.all([
            axios.get(`${process.env.API}/statistics?month=${month}`),  // Fetch statistics data
            axios.get(`${process.env.API}/bar-chart?month=${month}`), // Fetch bar chart data
            axios.get(`${process.env.API}/pie-chart?month=${month}`), // Fetch pie chart data
            axios.get(`${process.env.API}/transactions?month=${month}`) // Fetch transactions data
        ]);

        // Send the combined response
        res.status(200).json({
            statistics: statistics.data,
            barChart: barChart.data,
            pieChart: pieChart.data,
            transactions: transactions.data
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching combined data', error });
    }
};
