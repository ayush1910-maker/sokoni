import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";

const SubCategory = sequelize.define("sub_category" ,
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "category",
                key: "id"
            },
            onDelete: "CASCADE"
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false    
        }
    },
    {
        tableName: "sub_category",
        timestamps: true
    }
)

export default SubCategory