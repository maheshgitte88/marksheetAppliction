const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('MarksApp', 'dbmasteruser', 'Siw]hw+|4S6M(oUiA,zO[gcDL+,XrCWY', {
    host: 'ls-c3a229987345b69dbc12ce79dcf62d176ce228da.c3my0wgwwneq.ap-south-1.rds.amazonaws.com',
    dialect: 'mysql',
});
module.exports = sequelize;