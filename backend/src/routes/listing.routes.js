import express from "express"
import Joi from "joi"
import { upload } from "../utils/multer.js"
import verifyJWT from "../middlewares/auth.middleware.js"

import { Add_New_Listing, Add_New_Staff, delete_staff, edit_staff_details, get_StaffList } from "../controller/listing.controller.js"
import { validate } from "../utils/validate.js"

const router = express.Router()

/**
 * @swagger
 * /api/v1/listing/addNewListing:
 *   post:
 *     summary: Add New Listing
 *     description: Create a new listing with photos. If user role is Business, staff_id is required.
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
 *                 example: 75000
 *               location:
 *                 type: string
 *                 example: Indore, Madhya Pradesh
 *               item_condition:
 *                 type: string
 *                 enum: [new, used]
 *                 example: used
 *               description:
 *                 type: string
 *                 example: Slightly used iPhone 14 Pro in excellent condition.
 *               is_business:
 *                 type: boolean
 *                 example: true
 *               staff_id:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2]
 *               upload_photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Listing added successfully
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
 *                   example:
 *                     id: 10
 *                     user_id: 5
 *                     category_id: 1
 *                     sub_category_id: 2
 *                     title: iPhone 14 Pro
 *                     currency: INR
 *                     price: 75000
 *                     location: Indore
 *                     item_condition: used
 *                     description: Slightly used phone
 *                     is_business: true
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 status: false
 *                 message: Validation error message
 *       401:
 *         description: Unauthorized (Invalid or missing token)
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


/**
 * @swagger
 * /api/v1/listing/edit-staff-details/{staff_id}:
 *   patch:
 *     summary: Edit Staff Details
 *     description: Update staff details. Only users with Business role can edit their own staff members.
 *     tags:
 *       - Staff
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: staff_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 5
 *         description: ID of the staff to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Rahul Sharma
 *               email:
 *                 type: string
 *                 example: rahul@gmail.com
 *               phone_number:
 *                 type: string
 *                 pattern: "^[0-9]{10}$"
 *                 example: "9876543210"
 *               whatsapp_number:
 *                 type: string
 *                 pattern: "^[0-9]{10}$"
 *                 example: "9876543210"
 *             required:
 *               - phone_number
 *     responses:
 *       200:
 *         description: Staff details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 status: true
 *                 message: details edited successfully
 *                 data:
 *                   id: 5
 *                   business_id: 3
 *                   name: Rahul Sharma
 *                   email: rahul@gmail.com
 *                   phone_number: "9876543210"
 *                   whatsapp_number: "9876543210"
 *       400:
 *         description: Validation or business logic error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 status: false
 *                 message: another staff already exist with these phone number
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 */

router.patch("/edit-staff-details/:staff_id" , validate(Joi.object({
    name: Joi.string().min(3).optional(),
    email: Joi.string().email().optional(),
    phone_number: Joi.string().pattern(/^[0-9]{10}$/).required(),
    whatsapp_number: Joi.string().pattern(/^[0-9]{10}$/).optional(),
})), verifyJWT , edit_staff_details)


/**
 * @swagger
 * /api/v1/listing/delete-staff/{staff_id}:
 *   delete:
 *     summary: Delete Staff
 *     description: Delete a staff member. Only users with Business role can delete their own staff.
 *     tags:
 *       - Staff
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: staff_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 5
 *         description: ID of the staff to delete
 *     responses:
 *       200:
 *         description: Staff deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 status: true
 *                 message: staff deleted successfully
 *       400:
 *         description: Business logic error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               examples:
 *                 userNotFound:
 *                   value:
 *                     status: false
 *                     message: user not found
 *                 notBusiness:
 *                   value:
 *                     status: false
 *                     message: only business can delete staff
 *                 staffNotFound:
 *                   value:
 *                     status: false
 *                     message: Staff not found
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 */

router.delete("/delete-staff/:staff_id" , verifyJWT , delete_staff)

export default router