import User from "../models/user.models.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const generateAccessTokens = async function (userId) {
    try {
        const user = await User.findByPk(userId)

        const accessToken = jwt.sign(
            {
                id: user.id
            },
            process.env.JWT_SECRET,
            {expiresIn: "15d"}
        )

        return { accessToken }
        
    } catch (error) {
        console.log("Token generation error" , error.message);
    }
}

const register_user = async (req ,res) => {
    try {
        
        const {name , email , phone_number , role } = req.body

        const existedUser = await User.findOne({where: {phone_number}})

        if (existedUser) {
            return res.json({status: false , message: "Account already existed"})
        }

        const user = await User.create({
            name,
            email,
            phone_number,
            role
        })

        return res.json({
            status: true ,
            message: "User Registered successfully",
            data: user
        })

    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

const login = async (req ,res) => {
    try {

        const { phone_number } = req.body

        const existedUser = await User.findOne({where: {phone_number}})

        if (!existedUser) {
            return res.json({status: false , message: "User Not Found"})
        }

        const { accessToken } = await generateAccessTokens(existedUser.id)

         const options = {
            httpOnly: true,
            secure: true
        }

        return res
        .status(201)
        .cookie("accessToken", accessToken , options)
        .json({
            status: true,
            message: "user LoggedIn successfully",
            user: {
                id: existedUser.id,
                phone_number: existedUser.phone_number
            },
            accessToken
        })


        
    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

const send_otp = async (req ,res) => {
    try {

        const {phone_number} = req.body

        let account = await User.findOne({where: {phone_number}})

        if (!account) {
            return res.json({status: false , message: "account not found"})
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        const hashedOtp = await bcrypt.hash(otp , 10)

        account.otp = hashedOtp
        account.otp_expires = new Date(Date.now() + 10 * 60 * 1000)
        await account.save()

        return res.json({
            status: true,
            message: "otp send to your phone number",
            data: otp
        })

    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

const verify_otp = async (req ,res) => {
    try {

        const {phone_number , otp} = req.body

        const account = await User.findOne({where: {phone_number}})

        if (!account) {
            return res.json({status: false , message: "account not found"})
        }

        if (!account.otp || account.otp_expires < Date.now()) {
            return res.json({ status: false, message: "OTP expired" });
        }
        
        const isMatch = await bcrypt.compare(otp, account.otp);
        if (!isMatch){
           return res.json({ status: false, message: "Invalid OTP" });
        } 

        return res.json({status: true , message: "OTP verified"})
        
    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

export {
    register_user,
    login,
    send_otp,
    verify_otp
}