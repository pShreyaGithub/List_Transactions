const Product = require("../models/Product");

const transaction = async (req, res) => {
  const { month, search = "", page = 1, perPage = 10 } = req.query;

  try {
  const searchRegex = new RegExp(search, "i");
  const monthNumber = new Date(`${month} 1, 2000`).getMonth() + 1;

    const query = {
      $and: [
        ...(month
          ? [{ $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] } }]
          : []),
        ...(search
          ? [
              {
                $or: [
                  { title: { $regex: searchRegex } },
                  { description: { $regex: searchRegex } },
                  ...(Number(search)
                    ? [{ price: { $regex: searchRegex } }]
                    : []),
                ],
              },
            ]
          : []),
      ],
    };

    const products = await Product.aggregate([
      ...(month || search.length ? [{ $match: query }] : []),
      { $skip: (page - 1) * perPage },
      { $limit: parseInt(perPage) },
    ]);

    const totalProducts = await Product.countDocuments(
      month || search.length && query
    );

    res.status(200).json({
      total: totalProducts,
      page: parseInt(page),
      perPage: parseInt(perPage),
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { transaction };
