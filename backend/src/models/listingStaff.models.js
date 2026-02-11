import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";

const ListingStaff = sequelize.define("listing_staff" , 
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
        staff_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "staff",
                key: "id"
            },
            onDelete: "CASCADE"
        }
    },
    {
        tableName: "listing_staff",
        timestamps: true
    }
)

export default ListingStaff