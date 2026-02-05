import express from "express"
import Joi from "joi"
import { validate } from "../utils/validate.js"

import { login, register_user, send_otp, verify_otp } from "../controller/user.controller.js"

const router = express.Router()

/**
 * @swagger
 * /api/v1/users/register-user:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user with name, phone number, role, and optional email.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone_number
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ayush Sharma
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ayush@gmail.com
 *               phone_number:
 *                 type: string
 *                 example: "9876543210"
 *               role:
 *                 type: string
 *                 enum:
 *                   - Individual
 *                   - Business
 *                 example: Individual
 *     responses:
 *       200:
 *         description: User registered successfully
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
 *                   example: User Registered successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: Ayush Sharma
 *                     email:
 *                       type: string
 *                       example: ayush@gmail.com
 *                     phone_number:
 *                       type: string
 *                       example: "9876543210"
 *                     role:
 *                       type: string
 *                       example: Individual
 *       400:
 *         description: User already exists
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
 *                   example: Account already existed
 *       500:
 *         description: Server error
 */

router.post("/register-user" ,validate(Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().optional(),
    phone_number: Joi.string().pattern(/^[0-9]{10}$/).required(),
    role: Joi.string().valid("Individual" , "Business").required()
})), register_user)


/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Login user using phone number
 *     description: Logs in a user using phone number and returns JWT access token. Also sets accessToken in HTTP-only cookie.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone_number
 *             properties:
 *               phone_number:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       201:
 *         description: User logged in successfully
 *         headers:
 *           Set-Cookie:
 *             description: HTTP-only cookie containing access token
 *             schema:
 *               type: string
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
 *                   example: user LoggedIn successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     phone_number:
 *                       type: string
 *                       example: "9876543210"
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: User not found
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
 *                   example: User Not Found
 *       500:
 *         description: Server error
 */

router.post("/login" ,validate(Joi.object({
    phone_number: Joi.string().pattern(/^[0-9]{10}$/).required()
})), login)


/**
 * @swagger
 * /api/v1/users/send_otp:
 *   post:
 *     summary: Send OTP to user phone number
 *     description: Generates a 6-digit OTP, hashes it, stores it with expiry, and sends OTP to the registered phone number.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone_number
 *             properties:
 *               phone_number:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: OTP sent successfully
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
 *                   example: otp send to your phone number
 *                 data:
 *                   type: string
 *                   description: OTP value (only for testing; should not be returned in production)
 *                   example: "483921"
 *       400:
 *         description: Invalid phone number or user not found
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
 *                   example: User Not Found
 *       500:
 *         description: Server error
 */

router.post("/send_otp" , validate(Joi.object({
    phone_number: Joi.string().pattern(/^[0-9]{10}$/).required()
})), send_otp)


/**
 * @swagger
 * /api/v1/users/verify_otp:
 *   post:
 *     summary: Verify OTP
 *     description: Verifies the OTP sent to the user's phone number and checks expiry.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone_number
 *               - otp
 *             properties:
 *               phone_number:
 *                 type: string
 *                 example: "9876543210"
 *               otp:
 *                 type: string
 *                 example: "483921"
 *     responses:
 *       200:
 *         description: OTP verified successfully
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
 *                   example: OTP verified
 *       400:
 *         description: Invalid or expired OTP
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
 *                   example: Invalid OTP
 *       404:
 *         description: Account not found
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
 *                   example: account not found
 *       500:
 *         description: Server error
 */

router.post("/verify_otp" , validate(Joi.object({
    phone_number: Joi.string().pattern(/^[0-9]{10}$/).required(),
    otp: Joi.string().length(6).required()
})) , verify_otp)


export default router