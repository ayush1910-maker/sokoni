import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";

const Favourites = sequelize.define("favourites" , 
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users", 
                key: "id",
            },
            onDelete: "CASCADE",
        },
        listing_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "listing",
                key: "id"
            },
            onDelete: "CASCADE"
        }
    }, 
    {
        tableName: "favourites",
        timestamps: true
    }
)

export default Favourites