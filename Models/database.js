import {Sequelize} from 'sequelize'

//Database connection with dialect of postgres specifying the database we are using
export default new Sequelize('postgres', 'postgres', '1234', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
    omitNull: true
})