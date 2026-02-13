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

        const { category_id , sub_category_id, title, currency ,
            price, location, item_condition , description , staff_id
        } = req.body

        const user = await User.findByPk(user_id)
        if (!user) {
            return res.json({status: false , message: "user not found"})
        }

        const isBusiness = user.role === "Business"
        
        let StaffIds = []

        if (isBusiness) {

        StaffIds  = Array.isArray(staff_id) ? staff_id : [staff_id]

        if (StaffIds.length > 0) {
                
            const validStaff = await Staff.findAll({
                where: {
                    id: { [Op.in]: StaffIds, },
                    business_id: user_id
                }
            })
            
            if (validStaff.length !== StaffIds.length) {
                return res.json({ status: false, message: "Some staff not registered or invalid" })
            }
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
        },
        {
            transaction: t
        }
        )

    if (isBusiness) {
        const staffMapping  = StaffIds.map(staffId => ({
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

        if (user.role !== "Business") {
            res.json({status: false , message: "only business can add staff"})
        }

        const existingStaff = await Staff.findOne({
            where: {
                business_id: user_id,
                phone_number: phone_number
            }
        })

        if (existingStaff) {
            return res.json({status: false , message: "staff already existed"})
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

const edit_staff_details = async (req ,res ) => {
    try {
        const user_id = req.user.id 
        const staff_id = req.params.staff_id

        const {name , email , whatsapp_number , phone_number} = req.body
        
        const user = await User.findByPk(user_id)
        if (!user) {
            return res.json({status: false , message: "User Invalid!"})
        }

        if (user.role !== "Business") {
            return res.json({status: false , message: "only Business can edit staff details"})
        }
        
        const staff = await Staff.findOne({
            where: {
                id: staff_id,
                business_id: user_id
            }
        })

        if (!staff) {
            return res.json({status: false , message: "staff not found"})
        }

        if (phone_number) {
            const existingStaff = await Staff.findOne({
                where: {
                    business_id: user_id,
                    phone_number: phone_number,
                    id: {[Op.ne]: staff_id}
                }
            })

            if (existingStaff) {
                return res.json({
                    status: false,
                    message: "another staff already exist with these phone number"
                })
            }
        }

        const updateData = {}

        if (name !== undefined) updateData.name = name
        if (email !== undefined) updateData.email = email
        if (phone_number !== undefined) updateData.phone_number = phone_number
        if (whatsapp_number !== undefined) updateData.whatsapp_number = whatsapp_number
        
        await staff.update(updateData)

        return res.json({
            status: true,
            message: "details edited successfully",
            data: staff
        })        

    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

const delete_staff = async (req ,res) => {
    try {

        const user_id = req.user.id

        const staff_id = req.params.staff_id

        const user = await User.findByPk(user_id)
        if (!user) {
            return res.json({status: false , message: "user not found"})
        }

        if (user.role !== "Business") {
            return res.json({status: false , message: "only business can delete staff"})
        }

        const staff = await Staff.findOne({
            where: {
                id: staff_id,
                business_id: user_id
            }
        })

        if (!staff) {
            returnres.json({status: false , message: "Staff not found"})
        }

        await staff.destroy()

        return res.json({
            status: true,
            message: "staff deleted successfully",
        })
        
    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

export {
    Add_New_Listing,
    Add_New_Staff,
    get_StaffList,
    edit_staff_details,
    delete_staff
}