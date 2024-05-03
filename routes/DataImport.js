const express = require("express");
const router = express.Router();
const multer = require('multer');
const ExcelJS = require('exceljs');
const GradeSheet = require("../model/GradeSheet");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// router.post('/import', upload.single('importfile'), async (req, res) => {
//   try {
//     // const workbook = new ExcelJS.Workbook();
//     // await workbook.xlsx.readFile(req.file.path);
//     // const worksheet = workbook.getWorksheet(1);

//     const fileBuffer = req.file.buffer;
//     const workbook = new ExcelJS.Workbook();
//     await workbook.xlsx.load(fileBuffer);
//     const worksheet = workbook.getWorksheet(1);

//     const gradeSheetData = [];
//     let hasError = false;

//     worksheet.eachRow((row, rowNumber) => {
//       if (rowNumber === 1) {
//         // Skip header row
//         return;
//       }

//       const [
//         regNo,
//         studentName,
//         courseName,
//         specialization,
//         semester,
//         subCode,
//         obMark,
//         examCycle,
//         resultDate,
//       ] = row.values;

//       if (!regNo || !studentName || !courseName || !specialization || !semester || !subCode || !obMark || !examCycle || !resultDate) {
//         hasError = true;
//         console.error(`Error in row ${rowNumber}: Missing data`);
//         return;
//       }

//       gradeSheetData.push({
//         importDate: new Date().toISOString().slice(0, 10),
//         regNo,
//         studentName,
//         courseName,
//         specialization,
//         semester: parseInt(semester), // Ensure semester is an integer
//         subCode,
//         obMark: parseFloat(obMark), // Ensure obMark is a number
//         examCycle,
//         rdate: resultDate ? new Date(resultDate) : null,
//       });
//     });

//     if (hasError) {
//       return res.status(400).send('Error: Invalid data found in the uploaded file');
//     }

//     // Assuming you have a Sequelize model for GradeSheet
//     const createdGradeSheets = await GradeSheet.bulkCreate(gradeSheetData, { validate: true });

//     // Calculate grades and update flags in a separate transaction
//     await sequelize.transaction(async (transaction) => {
//       for (const gradeSheet of createdGradeSheets) {
//         const grade = calculateGrade(gradeSheet.obMark);
//         const gradePoint = calculateGradePoint(grade);

//         await gradeSheet.update({ grade, gradePoint, flag: 1 }, { transaction });
//       }
//     });

//     res.send('Grade sheets imported successfully!');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   } finally {
//     // Cleanup uploaded file
//     // fs.unlinkSync(req.file.path);
//   }
// });


router.post('/import', upload.single('importfile'), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileBuffer);
    const worksheet = workbook.getWorksheet(1);

    const gradeSheetData = [];
    let hasError = false;
    const errorMessages = []; // Store specific error messages

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        // Identify column indexes based on your header row (modify as needed)
        const regNoIndex = row.getCell(1).value;
        const studentNameIndex = row.getCell(2).value;
        const courseNameIndex = row.getCell(3).value;
        const specializationIndex = row.getCell(4).value;
        const semesterIndex = row.getCell(5).value;
        const subCodeIndex = row.getCell(6).value;
        const obMarkIndex = row.getCell(7).value;
        const examCycleIndex = row.getCell(8).value;
        const resultDateIndex = row.getCell(9).value;
        return;
      }

      const regNo = row.getCell(regNoIndex).value;
      const studentName = row.getCell(studentNameIndex).value;
      const courseName = row.getCell(courseNameIndex).value;
      const specialization = row.getCell(specializationIndex).value;
      const semester = parseInt(row.getCell(semesterIndex).value); // Ensure integer
      const subCode = row.getCell(subCodeIndex).value;
      const obMark = parseFloat(row.getCell(obMarkIndex).value); // Ensure number
      const examCycle = row.getCell(examCycleIndex).value;
      const resultDate = row.getCell(resultDateIndex).value ? new Date(row.getCell(resultDateIndex).value) : null;

      if (!regNo || !studentName || !courseName || !specialization || !semester || !subCode || !obMark || !examCycle || !resultDate) {
        hasError = true;
        errorMessages.push(`Error in row ${rowNumber}: Missing data`);
        return;
      }

      gradeSheetData.push({
        importDate: new Date().toISOString().slice(0, 10),
        regNo,
        studentName,
        courseName,
        specialization,
        semester,
        subCode,
        obMark,
        examCycle,
        rdate: resultDate,
      });
    });

    if (hasError) {
      return res.status(400).json({ error: 'Invalid data found in the uploaded file', details: errorMessages });
    }

    // Assuming you have a Sequelize model named GradeSheet
    const createdGradeSheets = await GradeSheet.bulkCreate(gradeSheetData, { validate: true });

    // Optional: Grade calculation and update in a transaction
    if (true) {
      await sequelize.transaction(async (transaction) => {
        for (const gradeSheet of createdGradeSheets) {
          const grade = calculateGrade(gradeSheet.obMark); // Replace with your logic
          await gradeSheet.update({ grade }, { transaction });
        }
      });
    }

    res.send('Grade sheets imported successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  } finally {
    // Optional: Cleanup uploaded file
    // fs.unlinkSync(req.file.path);
  }
});



function calculateGrade(obMark) {
    if (obMark > 0 && obMark <= 39.9) {
      return 'F';
    } else if (obMark >= 40 && obMark <= 44.9) {
      return 'D';
    } else if (obMark >= 45 && obMark <= 49.9) {
      return 'C';
    } else if (obMark >= 50 && obMark <= 54.9) {
      return 'C+';
    } else if (obMark >= 55 && obMark <= 59.9) {
      return 'B';
    } else if (obMark >= 60 && obMark <= 64.9) {
      return 'B+';
    } else if (obMark >= 65 && obMark <= 69.9) {
      return 'A';
    } else if (obMark >= 70 && obMark <= 74.9) {
      return 'A+';
    } else if (obMark >= 75 && obMark <= 100) {
      return 'O';
    } else {
      throw new Error('Invalid Mark: ' + obMark); // Handle invalid marks
    }
  }
  
  function calculateGradePoint(grade) {
    switch (grade) {
      case 'F':
        return 0;
      case 'D':
        return 4.5;
      case 'C':
        return 5;
      case 'C+':
        return 5.5;
      case 'B':
        return 6;
      case 'B+':
        return 7;
      case 'A':
        return 8;
      case 'A+':
        return 9;
      case 'O':
        return 10;
      default:
        throw new Error('Invalid Grade: ' + grade); // Handle invalid grades
    }
  }


//   function calculateGrade(obMark) {
//     if (obMark > 0 && obMark <= 39.9) {
//       return 'F';
//     } else if (obMark >= 40 && obMark <= 44.9) {
//       return 'D';
//     }
//     // ... Implement logic for other grades
//     else {
//       return 'O'; // Assuming 'O' is the highest grade
//     }
//   }
  
//   function calculateGradePoint(grade) {
//     switch (grade) {
//       case 'F':
//         return 0;
//       case 'D':
//         return 4.5;
//       // ... Implement logic for other grades
//       case 'O':
//         return 10;
//       default:
//         return null;
//     }
//   }
  



module.exports = router;
