import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";

const Staff = sequelize.define("staff" ,
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        business_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id"
            },
            onDelete: "CASCADE"
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
        whatsapp_number: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        tableName: "staff",
        timestamps: true
    }
)

export default Staff