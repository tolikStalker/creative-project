import {DataTypes, Sequelize} from 'sequelize'
import db from './database.js'


export default db.define("Chats", {
        sender: {
            type: DataTypes.STRING,
            allowNull: true
        },
        receiver: {
            type: DataTypes.STRING,
            allowNull: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: true
        },
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
    },
    {
        timestamps: false,
    }
)







