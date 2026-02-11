import Category from "../models/category.models.js";
import SubCategory from "../models/subCategory.models.js";

const Add_Category = async (req , res) => {
    try {
        let categoriesPayload = []

        if (Array.isArray(req.body.categories)) {
            categoriesPayload = req.body.categories
        }
        else if(req.body.title) {
            categoriesPayload = [{title: req.body.title}]
        }
        else{
            return res.json({status: false , message: "invalid category payload"})
        }

        const formattedCategories = categoriesPayload.map(cat => ({
            title: cat.title.trim()
        }))

        const createdCategories = await Category.bulkCreate(formattedCategories)

        return res.json({
            status: true,
            message: "Category(s) created successfully",
            data: createdCategories
        })

    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

const Add_Sub_Category = async (req , res) => {
    try {
    const { category_id }  = req.body

    const categoryId = await Category.findByPk(category_id)
    if (!categoryId) {
        return res.json({status: false , message: "Category not found"})
    }

    let subCategoriesPayload = []

    if (Array.isArray(req.body.subcategories)) {
        subCategoriesPayload = req.body.subcategories
    }
    else if (req.body.title){
        subCategoriesPayload = [{title: req.body.title}]
    }
    else{
        return res.json({status: false , message: "invalid subCategoryPayload"})
    }

    const formattedSubCategory = subCategoriesPayload.map(sub => ({
        category_id,
        title: sub.title.trim()
    }))

    const createdSubCategory = await SubCategory.bulkCreate(formattedSubCategory)

    return res.json({status: false , message: "SubCategories created successfully" , data: createdSubCategory})

    } catch (error) {
        return res.json({status: false , message:  error.message})
    }
}

const Update_Category = async (req , res) => {
    try {

        const {category_id , title} = req.body

        const updatedTitle = title.trim()

        const category = await Category.findByPk(category_id)
        if (!category) {
            return res.json({status: false , message: "Category not found"})
        }

        await category.update({title: updatedTitle})

        return res.json({
            status: true,
            message: "Category Update Successfully",
            data: updatedTitle
        })
        
    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

const Update_Sub_Category = async (req , res) => {
    try {

        const {sub_category_id , category_id , title} = req.body

        const updatedTitle = title.trim()
        
        const subCategory = await SubCategory.findByPk(sub_category_id)

        if (!subCategory) {
            return res.json({status: false , message: "sub category not found"})
        }

        await subCategory.update({
            title: updatedTitle,
            category_id
        })

        return res.json({
            status: true,
            message: "sub category updated successfully",
            data: {
                id: subCategory.id,
                category_id: subCategory.category_id,
                title: subCategory.title
            }
        })
    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

const delete_Category = async (req ,res) => {
    try {
        
        const { category_id } = req.body

        const category = await Category.findByPk(category_id)
        if (!category) {
            return res.json({status: false , message: "category not found"})
        }

        await category.destroy()

        return res.json({status: true , message: "Category deleted successfully"})  

    } catch (error) {
        return res.josn({status: false , message: error.message})
    }
}

const delete_sub_category = async (req , res) => {
    try {
        const { sub_category_id } = req.body

        const subcategory = await SubCategory.findByPk(sub_category_id)

        if (!subcategory) {
            return res.json({status: false , message: "sub-category not found"})
        }

        await subcategory.destroy()

        return res.json({
            status: false, 
            message: "sub-category deleted successfully",
        })


    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}


export {
    Add_Category,
    Add_Sub_Category,
    Update_Category,
    Update_Sub_Category,
    delete_Category,
    delete_sub_category
}