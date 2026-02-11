import Listing from "../models/listing.models.js"
import ListingPhoto from "../models/listingPhoto.models.js"
import Staff from "../models/staff.models.js"
import User from "../models/user.models.js"
import Category from "../models/category.models.js"
import SubCategory from "../models/subCategory.models.js"
import ListingStaff from "../models/listingStaff.models.js"


User.hasMany(Listing, {
    foreignKey: "user_id",
    as: "listings"
})

Listing.belongsTo(User, {
    foreignKey: "user_id",
    as: "user"
})

Listing.hasMany(ListingPhoto, {
    foreignKey: "listing_id",
    as: "photos"
})

ListingPhoto.belongsTo(Listing, {
    foreignKey: "listing_id",
    as: "listing"
})


User.hasMany(Staff, {
    foreignKey: "business_id",
    as: "staff"
})

Staff.belongsTo(User, {
    foreignKey: "business_id",
    as: "business"
})


Category.hasMany(SubCategory, {
    foreignKey: "category_id",
    as: "subCategories"
})

SubCategory.belongsTo(Category, {
    foreignKey: "category_id",
    as: "category"
})

Listing.belongsToMany(Staff, {
  through: "listing_staff",
  foreignKey: "listing_id"
});

Staff.belongsToMany(Listing, {
  through: "listing_staff",
  foreignKey: "staff_id"
});

export {
    User,
    Staff,
    Listing,
    ListingPhoto,
    Category,
    SubCategory
}