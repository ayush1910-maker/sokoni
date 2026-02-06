import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";

const Listing = sequelize.define("listing" , 
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
                model: "user", 
                key: "id",
            },
            onDelete: "CASCADE",
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "category",
                key: "id",
            },
            onDelete: "CASCADE"
        },
        sub_category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "sub_category",
                key: "id"
            },
            onDelete: "CASCADE"
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: false 
        },
        price: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false
        },
        item_condition: {
            type: DataTypes.ENUM("New" , "Used"),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        is_business: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        staff_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "staff",
                key: "id"
            },
            onDelete: "CASCADE"
        }
    },
    {
        tableName: "listing",
        timestamps: true
    }
)

export default Listing