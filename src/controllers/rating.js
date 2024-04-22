import Rating from "../models/rating.js";
import Product from "../models/product.js";
import { calcAvgRating } from "../helpers/rating.js";

export const rateProduct = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const { productId } = req.params;
    const userId = req.user._id;

    if (!userId || !productId) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid user or product not found" });
    }
    if (!rating) {
      return res
        .status(400)
        .json({ success: false, message: "Rating is required" });
    }

    // Check if the user has already rated the product
    let existingRating = await Rating.findOne({
      user: userId,
      product: productId,
    });

    if (existingRating) {
      // User has already rated this product before, update the existing rating
      existingRating.rating = rating;
      existingRating.review = review;
      await existingRating.save();
      const p = await Product.findById(productId).populate("ratings");
      p.avgRating = await calcAvgRating(p);
      await p.save();
    } else {
      // User rating the product for the first time, create a new rating
      const newRating = new Rating({
        user: userId,
        product: productId,
        rating,
        review,
      });
      await newRating.save();

      // Update the product's ratings array with the new rating's ObjectId
      await Product.findByIdAndUpdate(productId, {
        $push: { ratings: newRating._id },
      });

      // Calculate the average rating for the product
      let product = await Product.findById(productId).populate("ratings");
      product.avgRating = await calcAvgRating(product);
      await product.save();
    }

    const ratedProduct = await Product.findById(productId);

    return res.status(201).json({
      success: true,
      message: "Product rated successfully",
      rating,
      avgRating: ratedProduct.avgRating,
      review,
    });
  } catch (err) {
    console.error("Error rating product:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to rate product",
      error: err.message,
    });
  }
};
