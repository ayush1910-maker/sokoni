import Listing from "../models/listing.models.js";
import ListingPhoto from "../models/listingPhoto.models.js"
import Staff from "../models/staff.models.js";
import User from "../models/user.models.js";
import Category from "../models/category.models.js";
import SubCategory from "../models/subCategory.models.js";

User.hasMany(Listing , {
    foreignKey: "user_id"
})

Listing.belongsTo(ListingPhoto , {
    foreignKey: "user_id"
})


Listing.hasMany(ListingPhoto, {
    foreignKey: "listing_id"
})

ListingPhoto.belongsTo(Listing , {
    foreignKey: "listing_id"
})


User.hasMany(Staff , {
    foreignKey: "business_id"
})

Staff.belongsTo(User , {
    foreignKey: "business_id"
})