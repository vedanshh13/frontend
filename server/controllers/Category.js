// controllers/Category.js

const Category = require("../models/Category")

// Utility function to get a random integer up to max (exclusive)
function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

// Create a new Category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name field is required",
      })
    }

    const newCategory = await Category.create({
      name,
      description,
    })

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: newCategory,
    })
  } catch (error) {
    console.error("Error in createCategory:", error)
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    })
  }
}

// Get all categories
exports.showAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find()

    return res.status(200).json({
      success: true,
      data: allCategories,
    })
  } catch (error) {
    console.error("Error in showAllCategories:", error)
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    })
  }
}

// Get category page details: selected category courses, different category, top selling courses
exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "categoryId is required",
      })
    }

    // Find selected category and populate its published courses + their ratingAndReviews
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: "ratingAndReviews",
      })
      .exec()

    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      })
    }

    if (!selectedCategory.courses || selectedCategory.courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No published courses found for this category",
      })
    }

    // Find other categories except the selected one
    const otherCategories = await Category.find({
      _id: { $ne: categoryId },
    })

    let differentCategory = null
    if (otherCategories.length > 0) {
      const randomIndex = getRandomInt(otherCategories.length)
      differentCategory = await Category.findById(
        otherCategories[randomIndex]._id
      )
        .populate({
          path: "courses",
          match: { status: "Published" },
        })
        .exec()
    }

    // Find top 10 selling courses across all categories
    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
      })
      .exec()

    const allCourses = allCategories.flatMap((category) => category.courses)
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10)

    // Return all data
    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    })
  } catch (error) {
    console.error("Error in categoryPageDetails:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}
