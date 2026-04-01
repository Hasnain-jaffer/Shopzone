import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/ProductsModel.js";

dotenv.config();

const seedProducts = async () => {
  try {
    // 1. Connect to DB
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("DB Connected");

    // 2. Fetch data from the API
    const response = await fetch("https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/products.json");
    const data = await response.json();

    // 3. Map API fields to your Product model fields
    const products = data.map((item) => ({
      name: item.name,
      price: item.priceCents / 100,   // convert cents to actual price
      image: item.image,
      description: item.description,
      category: item.category,
      stock: 10,                       // default stock since API has none
    }));

    // 4. Clear existing products and insert new ones
    await Product.deleteMany({});
    console.log("Old products cleared");

    await Product.insertMany(products);
    console.log(`${products.length} products seeded successfully!`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedProducts();