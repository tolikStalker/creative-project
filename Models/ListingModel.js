import {DataTypes, Sequelize} from 'sequelize'
import db from './database.js'
import {status} from "../statusList.js";
import {practice} from "../practiceList.js";

const timezone = 3;
export default db.define("Posts", {
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Date.now() + timezone * 60 * 60 * 1000
    },
    description: {
        type: DataTypes.STRING(2048),
        allowNull: true
    },
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.CHAR(32),
        allowNull: false
    },
    owner: {
        type: DataTypes.STRING(255),
        allowNull: false,
        foreignKey: true
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    worker_count: {
        type: DataTypes.SMALLINT,
        allowNull: true,
        defaultValue: 1,
    },
    practice: {
        type: DataTypes.SMALLINT,
        allowNull: true,
        defaultValue: practice.no_experience
    },
    status: {
        type: DataTypes.SMALLINT,
        allowNull: true,
        defaultValue: status.start
    }
}, {timestamps: true})