import {DataTypes} from 'sequelize'
import db from './database.js'

export default db.define("reviews", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    rate: {
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    comment: {
        type: DataTypes.STRING(2048),
        allowNull: true
    },
    author: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    target: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
}, {timestamps: false})