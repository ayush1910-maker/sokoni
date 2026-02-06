import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";

const Category = sequelize.define("category" , 
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: "category",
        timestamps: true
    }
)

export default Category