const axios = require("axios");
const Product = require("./models/Product");
const connectDB = require("./config/db");

// * Database connection
connectDB();

async function seed() {
  try {
    console.log("seed Data start");
    const res = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
   const products = res.data;

   // Format the products to match our schema
   const formattedProducts = products.map((product) => ({
     title: product.title,
     price: product.price,
     description: product.description,
     category: product.category,
     image: product.image,
     sold: product.sold, 
     dateOfSale: product.dateOfSale, 
   }));

   await Product.insertMany(formattedProducts);
    console.log("seed Data end");
    process.exit();
  } catch (err) {
    console.error("error In seed", err.message);
    process.exit();
  }
}

seed();
