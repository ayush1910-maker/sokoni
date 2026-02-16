import { Op } from "sequelize";
import sequelize from "../db/db.js";
import Listing from "../models/listing.models.js";
import ListingPhoto from "../models/listingPhoto.models.js";
import Staff from "../models/staff.models.js";
import User from "../models/user.models.js";
import ListingStaff from "../models/listingStaff.models.js"
import SubCategory from "../models/subCategory.models.js";

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

const my_listing = async (req , res) => {
    try {
        const user_id = req.user.id

        const user = await User.findByPk(user_id)
        if (!user) {
            return res.json({status: false , message: "user not found"})
        }

        const listings = await Listing.findAll({
            where: {user_id},
            attributes: [
                "id",
                "title",
                "currency",
                "price",
                "item_condition",
                "description",
                "created_at"
            ],
            include: [
                {
                    model: ListingPhoto,
                    as: "photos",
                    attributes: ["id", "image_url"]
                },
                {
                    model: Staff,
                    as: "staff",
                    attributes: ["id" , "name"],
                    through: { attributes: [] }
                }
            ],
            order: [["created_at" , "DESC"]]
        })

        return res.json({
            status: true,
            message: "your listing fetched!",
            data: listings
        })
        
    } catch (error) {
        return res.json({status: false , message: error.message})
    }
}

const edit_listing = async (req, res) => {

    const t = await sequelize.transaction()

    try {

        const user_id = req.user.id
        const listing_id = req.params.listing_id

        const user = await User.findByPk(user_id)
        if (!user) {
            await t.rollback()
            return res.json({ status: false, message: "Unauthorized" })
        }

        const listing = await Listing.findOne({
            where: { id: listing_id, user_id }
        })

        if (!listing) {
            await t.rollback()
            return res.json({ status: false, message: "Listing not found" })
        }

        const {
            category_id,
            sub_category_id,
            title,
            currency,
            price,
            location,
            item_condition,
            description,
            staff_id
        } = req.body

        if (category_id && sub_category_id) {
            const validSub = await SubCategory.findOne({
                where: {
                    id: sub_category_id,
                    category_id: category_id
                }
            })

            if (!validSub) {
                await t.rollback()
                return res.json({
                    status: false,
                    message: "Invalid subcategory for selected category"
                })
            }
        }

        if (user.role !== "Business" && staff_id !== undefined) {
            await t.rollback()
            return res.json({
                status: false,
                message: "Only Business account can assign staff"
            })
        }

        const updateData = {}

        if (category_id !== undefined) updateData.category_id = category_id
        if (sub_category_id !== undefined) updateData.sub_category_id = sub_category_id
        if (title !== undefined) updateData.title = title
        if (currency !== undefined) updateData.currency = currency
        if (price !== undefined) updateData.price = price
        if (location !== undefined) updateData.location = location
        if (item_condition !== undefined) updateData.item_condition = item_condition
        if (description !== undefined) updateData.description = description

        await listing.update(updateData, { transaction: t })


        if (user.role === "Business" && staff_id !== undefined) {

            let StaffIds = Array.isArray(staff_id) ? staff_id : [staff_id]

            if (StaffIds.length > 0) {

                const validStaff = await Staff.findAll({
                    where: {
                        id: { [Op.in]: StaffIds },
                        business_id: user_id
                    }
                })

                if (validStaff.length !== StaffIds.length) {
                    await t.rollback()
                    return res.json({
                        status: false,
                        message: "Some staff not registered or invalid"
                    })
                }

                const existingMappings = await ListingStaff.findAll({
                    where: { listing_id }
                })

                const existingStaffIds = existingMappings.map(m => m.staff_id)

                const newStaffToAdd = StaffIds.filter(
                    id => !existingStaffIds.includes(Number(id))
                )

                if (newStaffToAdd.length > 0) {
                    const staffMapping = newStaffToAdd.map(staffId => ({
                        listing_id,
                        staff_id: staffId
                    }))

                    await ListingStaff.bulkCreate(staffMapping, {
                        transaction: t
                    })
                }
            }
        }

        // ========================
        if (req.files && req.files.length > 0) {

            const existingPhotoCount = await ListingPhoto.count({
                where: { listing_id }
            })

            const totalPhotos = existingPhotoCount + req.files.length

            if (totalPhotos > 10) {
                await t.rollback()
                return res.json({
                    status: false,
                    message: `Maximum 10 photos allowed. Currently ${existingPhotoCount} exist.`
                })
            }

            const newPhotos = req.files.map(file => ({
                listing_id,
                image_url: file.filename
            }))

            await ListingPhoto.bulkCreate(newPhotos, {
                transaction: t
            })
        }

        await t.commit()

        return res.json({
            status: true,
            message: "Listing updated successfully"
        })

    } catch (error) {
        await t.rollback()
        return res.json({ status: false , message: error.message })
    }
}

const delete_listing_photo = async (req, res) => {
    try {

        const user_id = req.user.id
        const { photo_id } = req.params

        const photo = await ListingPhoto.findByPk(photo_id, {
            include: {
                model: Listing,
                as: "listing"
            }
        })

        if (!photo || photo.listing.user_id !== user_id) {
            return res.json({
                status: false,
                message: "Not authorized"
            })
        }

        await photo.destroy()

        return res.json({
            status: true,
            message: "Photo deleted successfully"
        })

    } catch (error) {
        return res.json({ status: false, message: error.message })
    }
}

const remove_listing_staff = async (req, res) => {
    try {

        const user_id = req.user.id
        const { listing_id, staff_id } = req.params

        const user = await User.findByPk(user_id)
        if (!user) {
            return res.json({ status: false, message: "Unauthorized" })
        }

        const listing = await Listing.findOne({
            where: { id: listing_id, user_id }
        })

        if (!listing) {
            return res.json({ status: false, message: "Listing not found" })
        }

        const deleted = await ListingStaff.destroy({
            where: {
                listing_id,
                staff_id
            }
        })

        if (!deleted) {
            return res.json({
                status: false,
                message: "Staff not attached to this listing"
            })
        }

        return res.json({
            status: true,
            message: "Staff removed from listing successfully"
        })

    } catch (error) {
        return res.json({ status: false, message: error.message })
    }
}

const delete_listing = async (req  ,res) => {
    const t = await sequelize.transaction()
    
    try {

        const user_id = req.user.id
        const listing_id = req.params.listing_id

        const user = await User.findByPk(user_id)
        if (!user) {
            await t.rollback()
            return res.json({ status: false, message: "Unauthorized" })
        }

        const listing = await Listing.findOne({
            where: {id: listing_id , user_id}
        })

        if (!listing) {
            await t.rollback()
            return res.json({status: false , message: "Listing not found"})
        }

        await ListingPhoto.destroy({
            where: { listing_id },
            transaction: t
        })

    
        await ListingStaff.destroy({
            where: { listing_id },
            transaction: t
        })

    
        await listing.destroy({ transaction: t })

        await t.commit()

        return res.json({
            status: true,
            message: "Listing deleted successfully"
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
    delete_staff,
    my_listing,
    edit_listing,
    delete_listing,
    delete_listing_photo,
    remove_listing_staff
}