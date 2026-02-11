import express from "express"
import Joi from "joi"
import { validate } from "../utils/validate.js"

import { Add_Category, Add_Sub_Category, delete_Category, delete_sub_category, Update_Category, Update_Sub_Category } from "../controller/admin.controller.js"

const router = express.Router()

/**
 * @swagger
 * /api/v1/admin/addCategory:
 *   post:
 *     summary: Add category (single or bulk)
 *     description: |
 *       Creates category records.
 *       - You can create **one category** using `title`
 *       - OR **multiple categories** using `categories` array
 *     tags:
 *       - Admin / Category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 required:
 *                   - title
 *                 properties:
 *                   title:
 *                     type: string
 *                     minLength: 3
 *                     maxLength: 50
 *                     example: Electronics
 *               - type: object
 *                 required:
 *                   - categories
 *                 properties:
 *                   categories:
 *                     type: array
 *                     minItems: 1
 *                     items:
 *                       type: object
 *                       required:
 *                         - title
 *                       properties:
 *                         title:
 *                           type: string
 *                           minLength: 3
 *                           maxLength: 50
 *                           example: Mobiles
 *     responses:
 *       200:
 *         description: Category(s) created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Category(s) created successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       title:
 *                         type: string
 *                         example: Electronics
 *       400:
 *         description: Invalid category payload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: invalid category payload
 *       500:
 *         description: Server error
 */

const addCategorySchema = Joi.alternatives().try(

  Joi.object({
    title: Joi.string()
      .trim()
      .min(3)
      .max(50)
      .required()
  }),

  // 🔹 multiple categories
  Joi.object({
    categories: Joi.array()
      .items(
        Joi.object({
          title: Joi.string()
            .trim()
            .min(3)
            .max(50)
            .required()
        })
      )
      .min(1) 
      .required()
  })

)
router.post("/addCategory" ,validate(addCategorySchema), Add_Category)


/**
 * @swagger
 * /api/v1/admin/addSubCategory:
 *   post:
 *     summary: Add sub-category (single or bulk)
 *     description: |
 *       Creates sub-categories under a given category.
 *       - Create **one sub-category** using `title`
 *       - OR create **multiple sub-categories** using `subcategories` array
 *     tags:
 *       - Admin / SubCategory
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 required:
 *                   - category_id
 *                   - title
 *                 properties:
 *                   category_id:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     minLength: 3
 *                     maxLength: 15
 *                     example: Mobiles
 *               - type: object
 *                 required:
 *                   - category_id
 *                   - subcategories
 *                 properties:
 *                   category_id:
 *                     type: integer
 *                     example: 1
 *                   subcategories:
 *                     type: array
 *                     minItems: 1
 *                     items:
 *                       type: object
 *                       required:
 *                         - title
 *                       properties:
 *                         title:
 *                           type: string
 *                           minLength: 3
 *                           maxLength: 15
 *                           example: Smartphones
 *     responses:
 *       200:
 *         description: Sub-category(s) created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: SubCategories created successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 10
 *                       category_id:
 *                         type: integer
 *                         example: 1
 *                       title:
 *                         type: string
 *                         example: Mobiles
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Category not found
 *       400:
 *         description: Invalid sub-category payload
 *       500:
 *         description: Server error
 */

const addSubCategorySchema = Joi.alternatives().try(

  // single sub-category
  Joi.object({
    category_id: Joi.number().required(),
    title: Joi.string().min(3).max(15).required()
  }),

  // bulk sub-categories
  Joi.object({
    category_id: Joi.number().required(),
    subcategories: Joi.array()
      .items(
        Joi.object({
          title: Joi.string().min(3).max(15).required()
        })
      )
      .min(1)
      .required()
  })

)
router.post("/addSubCategory" , validate(addSubCategorySchema) , Add_Sub_Category)


/**
 * @swagger
 * /api/v1/admin/updateCategory:
 *   put:
 *     summary: Update a category
 *     description: Updates the title of an existing category using category ID.
 *     tags:
 *       - Admin / Category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category_id
 *               - title
 *             properties:
 *               category_id:
 *                 type: integer
 *                 example: 1
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 15
 *                 example: Home Appliances
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Category updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: Home Appliances
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Category not found
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */

router.put("/updateCategory" , validate(Joi.object({
    category_id: Joi.number().required(),
    title: Joi.string().min(3).max(15).required()
})) , Update_Category)

/**
 * @swagger
 * /api/v1/admin/updateSubCategory:
 *   put:
 *     summary: Update a sub-category
 *     description: Updates the title or parent category of an existing sub-category.
 *     tags:
 *       - Admin / SubCategory
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sub_category_id
 *               - category_id
 *               - title
 *             properties:
 *               sub_category_id:
 *                 type: integer
 *                 example: 5
 *               category_id:
 *                 type: integer
 *                 example: 2
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 15
 *                 example: Smartphones
 *     responses:
 *       200:
 *         description: Sub-category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: sub category updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 5
 *                     category_id:
 *                       type: integer
 *                       example: 2
 *                     title:
 *                       type: string
 *                       example: Smartphones
 *       404:
 *         description: Sub-category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: sub category not found
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */

router.put("/updateSubCategory" , validate(Joi.object({
    category_id: Joi.number().required(),
    sub_category_id: Joi.number().required(),
    title: Joi.string().min(3).max(15).required()
})), Update_Sub_Category)


/**
 * @swagger
 * /api/v1/admin/deleteCategory:
 *   delete:
 *     summary: Delete a category
 *     description: Deletes a category using its category ID.
 *     tags:
 *       - Admin / Category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category_id
 *             properties:
 *               category_id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Category deleted successfully
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: category not found
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */

router.delete("/deleteCategory" , validate(Joi.object({
    category_id: Joi.number().required(),
})) , delete_Category)

/**
 * @swagger
 * /api/v1/admin/deleteSubCategory:
 *   delete:
 *     summary: Delete a sub-category
 *     description: Deletes a sub-category using its sub-category ID.
 *     tags:
 *       - Admin / SubCategory
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sub_category_id
 *             properties:
 *               sub_category_id:
 *                 type: integer
 *                 example: 7
 *     responses:
 *       200:
 *         description: Sub-category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: sub-category deleted successfully
 *       404:
 *         description: Sub-category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: sub-category not found
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */

router.delete("/deleteSubCategory" , validate(Joi.object({
    sub_category_id: Joi.number().required(),
})), delete_sub_category)


export default router