import Listing from "../models/listing.models.js"
import ListingPhoto from "../models/listingPhoto.models.js"
import Staff from "../models/staff.models.js"
import User from "../models/user.models.js"
import Category from "../models/category.models.js"
import SubCategory from "../models/subCategory.models.js"
import ListingStaff from "../models/listingStaff.models.js"
import Favourites from "../models/favourites.models.js"

User.hasMany(Listing, {
    foreignKey: "user_id",
    as: "listings",
    onDelete: "CASCADE"
})

Listing.belongsTo(User, {
    foreignKey: "user_id",
    as: "user"
})


Listing.hasMany(ListingPhoto, {
    foreignKey: "listing_id",
    as: "photos",
    onDelete: "CASCADE"
})

ListingPhoto.belongsTo(Listing, {
    foreignKey: "listing_id",
    as: "listing"
})


User.hasMany(Staff, {
    foreignKey: "business_id",
    as: "staff",
    onDelete: "CASCADE"
})

Staff.belongsTo(User, {
    foreignKey: "business_id",
    as: "business"
})


Category.hasMany(SubCategory, {
    foreignKey: "category_id",
    as: "subCategories",
    onDelete: "CASCADE"
})

SubCategory.belongsTo(Category, {
    foreignKey: "category_id",
    as: "category"
})


Category.hasMany(Listing, {
    foreignKey: "category_id",
    as: "listings"
})

SubCategory.hasMany(Listing, {
    foreignKey: "sub_category_id",
    as: "listings"
})

Listing.belongsTo(Category, {
    foreignKey: "category_id",
    as: "category"
})

Listing.belongsTo(SubCategory, {
    foreignKey: "sub_category_id",
    as: "subCategory"
})


Listing.belongsToMany(Staff, {
    through: ListingStaff,
    foreignKey: "listing_id",
    otherKey: "staff_id",
    as: "staff"
})

Staff.belongsToMany(Listing, {
    through: ListingStaff,
    foreignKey: "staff_id",
    otherKey: "listing_id",
    as: "listings"
})


Favourites.belongsTo(User, {
    foreignKey: "user_id",
    as: "user"
})

Favourites.belongsTo(Listing, {
    foreignKey: "listing_id",
    as: "listing"
})

User.hasMany(Favourites, {
    foreignKey: "user_id",
    as: "favourites",
    onDelete: "CASCADE"
})

Listing.hasMany(Favourites, {
    foreignKey: "listing_id",
    as: "favourites",
    onDelete: "CASCADE"
})

export {
    User,
    Staff,
    Listing,
    ListingPhoto,
    Category,
    SubCategory,
    ListingStaff
}
