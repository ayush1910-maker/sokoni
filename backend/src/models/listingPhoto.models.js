import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";

const ListingPhoto = sequelize.define("listing_photos", 
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        listing_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "listing",
                key: "id"
            },
            onDelete: "CASCADE"
        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: "listing_photos",
        timestamps: true
    }
)

export default ListingPhoto