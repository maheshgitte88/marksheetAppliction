const { DataTypes } = require('sequelize');
const sequelize = require('../config'); // Assuming your database config is here

const GradeSheet = sequelize.define('GradeSheet', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sheet_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reg_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    exam_cycle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    semester: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    import_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    student_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    course_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    specialization: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sub_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ob_mark: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rdate: {
      type: DataTypes.DATE,
    },
    flag: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Flag set to 0 initially
    },
    gs_flag: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    grade: {
      type: DataTypes.STRING,
    },
    grade_point: {
      type: DataTypes.DECIMAL(10, 2), // Adjust precision if needed
    },
  });
  
  module.exports = GradeSheet;

