import express from "express"
import Joi from "joi"
import { upload } from "../utils/multer.js"
import verifyJWT from "../middlewares/auth.middleware.js"

import { Add_New_Listing, Add_New_Staff, get_StaffList } from "../controller/listing.controller.js"
import { validate } from "../utils/validate.js"

const router = express.Router()

/**
 * @swagger
 * /api/v1/listing/addNewListing:
 *   post:
 *     summary: Create a new listing
 *     description: |
 *       Creates a new listing with photos.
 *       - Requires JWT authentication
 *       - Minimum 1 photo and maximum 10 photos
 *       - If `is_business` is true, `staff_id` array is required
 *     tags:
 *       - Listing
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - category_id
 *               - sub_category_id
 *               - title
 *               - currency
 *               - price
 *               - location
 *               - item_condition
 *               - description
 *               - is_business
 *               - upload_photos
 *             properties:
 *               category_id:
 *                 type: integer
 *                 example: 1
 *               sub_category_id:
 *                 type: integer
 *                 example: 2
 *               title:
 *                 type: string
 *                 example: iPhone 14 Pro
 *               currency:
 *                 type: string
 *                 example: INR
 *               price:
 *                 type: number
 *                 example: 85000
 *               location:
 *                 type: string
 *                 example: Indore
 *               item_condition:
 *                 type: string
 *                 example: Used
 *               description:
 *                 type: string
 *                 example: Excellent condition, 6 months old.
 *               is_business:
 *                 type: boolean
 *                 example: false
 *               staff_id:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [3, 4]
 *               upload_photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Listing created successfully
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
 *                   example: listing addedd successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 10
 *                     title:
 *                       type: string
 *                       example: iPhone 14 Pro
 *       400:
 *         description: Validation error or invalid staff
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 *       500:
 *         description: Server error
 */

const addNewListingValidation = validate(
    Joi.object({
        category_id: Joi.number().required(),

        sub_category_id: Joi.number().required(),

        title: Joi.string().min(3).max(100).required(),

        currency: Joi.string().required(),

        price: Joi.number()
            .positive()
            .required(),

        location: Joi.string()
            .min(3)
            .max(100)
            .required(),

        item_condition: Joi.string()
            .valid("new", "used")
            .required(),

        description: Joi.string()
            .min(10)
            .max(1000)
            .required(),

        is_business: Joi.boolean().required(),

        staff_id: Joi.when("is_business", {
            is: true,
            then: Joi.array()
                .items(Joi.number().required())
                .min(1)
                .required(),
            otherwise: Joi.forbidden()
        })
    })
);

router.post(
    "/addNewListing",
    addNewListingValidation,
    verifyJWT ,
    upload.array("upload_photos" , 10) ,
    Add_New_Listing
)

/**
 * @swagger
 * /api/v1/listing/addNewStaff:
 *   post:
 *     summary: Add New Staff
 *     description: Create a new staff member under logged-in business user.
 *     tags:
 *       - Staff
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone_number
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *                 example: Rahul Sharma
 *               email:
 *                 type: string
 *                 format: email
 *                 example: rahul@gmail.com
 *               phone_number:
 *                 type: string
 *                 pattern: "^[0-9]{10}$"
 *                 example: "9876543210"
 *               whatsapp_number:
 *                 type: string
 *                 pattern: "^[0-9]{10}$"
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: Staff created successfully
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
 *                   example: New Staff Addedd successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     business_id:
 *                       type: integer
 *                       example: 5
 *                     name:
 *                       type: string
 *                       example: Rahul Sharma
 *                     email:
 *                       type: string
 *                       example: rahul@gmail.com
 *                     phone_number:
 *                       type: string
 *                       example: "9876543210"
 *                     whatsApp_number:
 *                       type: string
 *                       example: "9876543210"
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 *       400:
 *         description: Validation error or user not found
 */

router.post("/addNewStaff"  ,validate(Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    phone_number: Joi.string().pattern(/^[0-9]{10}$/).required(),
    whatsapp_number: Joi.string().pattern(/^[0-9]{10}$/).optional(),
})), verifyJWT , Add_New_Staff)

/**
 * @swagger
 * /api/v1/listing/getStaffList:
 *   get:
 *     summary: Get Staff List
 *     description: Fetch all staff members of the logged-in business user.
 *     tags:
 *       - Staff
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Staff list fetched successfully
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
 *                   example: Staff List Fetched
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       business_id:
 *                         type: integer
 *                         example: 5
 *                       name:
 *                         type: string
 *                         example: Rahul Sharma
 *                       email:
 *                         type: string
 *                         example: rahul@gmail.com
 *                       phone_number:
 *                         type: string
 *                         example: "9876543210"
 *                       whatsApp_number:
 *                         type: string
 *                         example: "9876543210"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2026-02-11T10:30:00.000Z
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         example: 2026-02-11T10:30:00.000Z
 *       401:
 *         description: Unauthorized (Invalid or missing JWT token)
 *       500:
 *         description: Internal server error
 */

router.get("/getStaffList" , verifyJWT , get_StaffList)

export default router