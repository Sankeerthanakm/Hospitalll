const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const filePath = path.join(__dirname, 'hospitalData.json');

app.use(express.json());


function readData() {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data:', error);
        return [];
    }
}


function writeData(data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log('Data written successfully.');
    } catch (error) {
        console.error('Error writing data:', error);
    }
}


app.get('/hospitals', (req, res) => {
    const hospitals = readData();
    res.json(hospitals);
});


app.post('/hospitals', (req, res) => {
    const { name, patientCount, location } = req.body;
    const hospitals = readData();
    hospitals.push({ name, patientCount, location });
    writeData(hospitals);
    res.status(201).send('Hospital added successfully.');
});


app.put('/hospitals/:index', (req, res) => {
    const index = req.params.index;
    const newData = req.body;
    const hospitals = readData();
    if (index >= 0 && index < hospitals.length) {
        hospitals[index] = { ...hospitals[index], ...newData };
        writeData(hospitals);
        res.send('Hospital updated successfully.');
    } else {
        res.status(404).send('Hospital not found.');
    }
});


app.delete('/hospitals/:index', (req, res) => {
    const index = req.params.index;
    const hospitals = readData();
    if (index >= 0 && index < hospitals.length) {
        hospitals.splice(index, 1);
        writeData(hospitals);
        res.send('Hospital deleted successfully.');
    } else {
        res.status(404).send('Hospital not found.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
