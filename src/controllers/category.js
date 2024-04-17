import Category from "../models/category.js";
import slugify from "slugify";

export const createCategory = async (req, res) => {
    try {
        const { name } = req.body
        if(!name) {
            return res.status(400).json("Name is required")
        }

        const existingCategory = await Category.findOne({name})
        if(existingCategory) {
            return res.status(400).json({success: false, message: "Category already exists"})
           
        }
        const category = await new Category({name, slug: slugify(name)}).save()
        res.status(201).json({success: true, message: "Category created successfully", category})
        
    } catch (err) {
        console.log(err);
        res.status(500).json({
        success: false,
        message: "Something went wrong",
        errMessage: err.message
        })
    }
}


//getAllCategory





//getOneCategory








//updateCategory










//deleteCategory