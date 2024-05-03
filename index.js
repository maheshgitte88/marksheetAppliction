const express = require('express');
const cors=require('cors');
// const multer=require('multer');
// const ExcelJS= require('exceljs');
const sequelize = require('./config')
const DataRoutes = require('./routes/DataImport');

const port =1800;
const app= express();
app.use(cors());
app.use(express.json())

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });


sequelize
    .authenticate()
    .then(() => {
        console.log('Connection to the database has been established successfully.');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

(async () => {
    try {
        await sequelize.sync();
        console.log('all require Table created successfully.');
    } catch (error) {
        console.error('Error creating table:', error);
    }
})();

app.use('/data', DataRoutes);





app.listen(port, () =>{
 console.log(`server running on port ${port}`)
})
