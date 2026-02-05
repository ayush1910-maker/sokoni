import sequelize from "../db/db.js"
import { DataTypes } from "sequelize"

const User = sequelize.define("user" , 
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM("Individual" , "Business"),
            allowNull: false
        },
        otp: {
            type: DataTypes.STRING,
            allowNull: true
        },
        otp_expires: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        tableName: "user",
        timestamps: true
    }
)

export default User