import {DataTypes} from 'sequelize'
import db from './database.js'

export default db.define("users", {
    userLogin: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    userPassword: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.CHAR(32),
        allowNull: false
    },
    surname: {
        type: DataTypes.CHAR(32),
        allowNull: false
    },
    patronymic: {
        type: DataTypes.CHAR(32),
        allowNull: false
    },
    city: {
        type: DataTypes.CHAR(32),
        allowNull: false
    },
    birthDate: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {timestamps: false})