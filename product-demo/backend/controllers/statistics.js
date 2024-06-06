const { default: axios } = require("axios");
const Product = require("../models/Product");

const stats = async (req, res) => {
  const { month } = req.query;

  const monthNumber = new Date(`${month} 1, 2000`).getMonth() + 1; // +1 because getMonth() returns 0-11

  try {
    const stats = await Product.aggregate([
      ...(month
        ? [
            {
              $match: {
                $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
              },
            },
          ]
        : []),
      {
        $facet: {
          totalSaleAmount: [
            { $match: { sold: true } },
            { $group: { _id: null, total: { $sum: "$price" } } },
          ],
          totalSoldItems: [{ $match: { sold: true } }, { $count: "total" }],
          totalNotSoldItems: [{ $match: { sold: false } }, { $count: "total" }],
        },
      },
    ]);

    const totalSaleAmount = stats[0].totalSaleAmount[0]?.total || 0;
    const totalSoldItems = stats[0].totalSoldItems[0]?.total || 0;
    const totalNotSoldItems = stats[0].totalNotSoldItems[0]?.total || 0;

    res.status(200).json({
      totalSaleAmount,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const priceStats = async (req, res) => {
  const { month } = req.query;

  const monthNumber = new Date(`${month} 1, 2000`).getMonth() + 1; // +1 because getMonth() returns 0-11

  try {
    const priceRanges = [
      { range: "0-100", min: 0, max: 100 },
      { range: "101-200", min: 101, max: 200 },
      { range: "201-300", min: 201, max: 300 },
      { range: "301-400", min: 301, max: 400 },
      { range: "401-500", min: 401, max: 500 },
      { range: "501-600", min: 501, max: 600 },
      { range: "601-700", min: 601, max: 700 },
      { range: "701-800", min: 701, max: 800 },
      { range: "801-900", min: 801, max: 900 },
      { range: "901-above", min: 901, max: Infinity },
    ];

    const matchStage = {
      $match: {
        $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
      },
    };

    const facets = priceRanges.reduce((acc, range) => {
      acc[range.range] = [
        { $match: { price: { $gte: range.min, $lte: range.max } } },
        { $count: "count" },
      ];
      return acc;
    }, {});

    const results = await Product.aggregate([
      ...(month ? [matchStage] : []),
      { $facet: facets },
    ]);

    const barChartData = priceRanges.map((range) => ({
      range: range.range,
      count: results[0][range.range][0]?.count || 0,
    }));

    res.status(200).json(barChartData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get pie chart data for a selected month
const categoryStats = async (req, res) => {
  const { month } = req.query;

  const monthNumber = new Date(`${month} 1, 2000`).getMonth() + 1; // +1 because getMonth() returns 0-11

  try {
    const results = await Product.aggregate([
      ...(month
        ? [
            {
              $match: {
                $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
              },
            },
          ]
        : []),
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    const pieChartData = results.map((result) => ({
      category: result._id,
      count: result.count,
    }));

    res.status(200).json(pieChartData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const combinedStats = async (req, res) => {
  const baseURL = `${req.protocol}://${req.get("host")}`;
  const { month } = req.query;
  try {
    const [stats, priceStats, categoryStats] = await Promise.all([
      axios.get(`${baseURL}/api/stats`, {
        params: { month },
      }),
      axios.get(`${baseURL}/api/priceStats`, {
        params: { month },
      }),
      axios.get(`${baseURL}/api/categoryStats`, {
        params: { month },
      }),
    ]);
    res
      .status(200)
      .json({
        stats: stats.data,
        priceStats: priceStats.data,
        categoryStats: categoryStats.data,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { stats, priceStats, categoryStats, combinedStats };
