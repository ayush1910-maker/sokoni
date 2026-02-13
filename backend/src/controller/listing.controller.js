import { Op } from "sequelize";
import sequelize from "../db/db.js";
import Listing from "../models/listing.models.js";
import ListingPhoto from "../models/listingPhoto.models.js";
import Staff from "../models/staff.models.js";
import User from "../models/user.models.js";
import ListingStaff from "../models/listingStaff.models.js"

const Add_New_Listing = async (req ,res) => {

    if (!req.files || req.files.length === 0 || req.files.length > 10) {
        return res.json({status: false , message: "at least 1 photo required and maximum will 10"})
    }

    const t = await sequelize.transaction()

    try {

        const user_id = req.user.id

        const {category_id , sub_category_id, title, currency , price, location, item_condition , 
          description , is_business , staff_id
        } = req.body

        const isBusiness = user.role === "Business"

        const user = await User.findByPk(user_id)
        if (!user) {
            return res.json({status: false , message: "user not found"})
        }

        let validStaff = []

        if (isBusiness) {

            validStaff = await Staff.findAll({
                where: {
                    id: { [Op.in]: staff_id, },
                    business_id: user_id
                }
            })
            
            if (validStaff.length !== staff_id.length) {
                return res.json({ status: false, message: "Some staff not registered or invalid" })
            }
        }

        const listing = await Listing.create(
        {
            user_id,
            category_id,
            sub_category_id,
            title,
            currency,
            price,
            location,
            item_condition,
            description,
            is_business: isBusiness,
            staff_id : is_business === "true" ? staff_id : null
        },
        {
            transaction: t
        }
    )

    if (isBusiness) {
        const staffMapping  = staff_id.map(staffId => ({
            listing_id: listing.id,
            staff_id: staffId
        }))

        await ListingStaff.bulkCreate(staffMapping , 
            {
                transaction: t
            }
        )
    }


    const upload_photos = req.files.map((file) => ({
        listing_id: listing.id,
        image_url: file.filename
    }))

    await ListingPhoto.bulkCreate(upload_photos ,
        {
            transaction: t
        }
    )

    await t.commit()

    return res.json({
        status: true,
        message: "listing addedd successfully",
        data: listing
    })
        
    } catch (error) {
        await t.rollback()
        return res.json({status: false , message: error.message})
    }
}

const Add_New_Staff = async (req ,res) => {
    try {
        
        const user_id = req.user.id

        const {name , email , phone_number , whatsapp_number} = req.body

        const user = await User.findByPk(user_id)
        if (!user) {
            return res.json({status: false , message: "User Not found"})            
        }

        const AddStaff = await Staff.create({
            business_id: user_id,
            name,
            email,
            phone_number,
            whatsapp_number
        })

        return res.json({
            status: true,
            message: "New Staff Addedd successfully",
            data: AddStaff
        })

    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

const get_StaffList = async (req ,res) => {
    try {

        const business_id = req.user.id
        
        const StaffList = await Staff.findAll({
            where: { business_id },
            order: [["created_at" , "DESC"]]
        })

        return res.json({
            status: true,
            message: "Staff List Fetched",
            data: StaffList
        })

    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

export {
    Add_New_Listing,
    Add_New_Staff,
    get_StaffList
}