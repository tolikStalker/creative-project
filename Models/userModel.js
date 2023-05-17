import {DataTypes} from 'sequelize'
import db from './database.js'

export default db.define("users", {
    userLogin: {
        type: DataTypes.STRING(255),
        primaryKey: true,
        allowNull: false
    },
    userPassword: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(32),
        allowNull: false
    },
    surname: {
        type: DataTypes.STRING(32),
        allowNull: false
    },
    patronymic: {
        type: DataTypes.STRING(32),
        allowNull: true
    },
    city: {
        type: DataTypes.STRING(32),
        allowNull: false
    },
    birth_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    education: {
        type: DataTypes.STRING(1024),
        allowNull: false
    },
    phone_number: {
        type: DataTypes.STRING(12),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(64),
        allowNull: false
    },
    specialization: {
        type: DataTypes.STRING(128),
        allowNull: false
    },
    gender: {
        type: DataTypes.CHAR(1),
        allowNull: false
    },
}, {timestamps: false})