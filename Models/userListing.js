import {DataTypes} from 'sequelize'
import db from './database.js'

export default db.define("Posts", {
    name: {
        type: DataTypes.CHAR(32),
        allowNull: false
    },
    owner: {
        type: DataTypes.STRING,
        allowNull: false,
        foreignKey: true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    desc: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {timestamps: false})