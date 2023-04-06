import {DataTypes, Sequelize} from 'sequelize'
import db from './database.js'

const timezone = 3;
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
        allowNull: false,
        defaultValue: Date.now()+timezone*60*60*1000
    },
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    desc: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {timestamps: false})