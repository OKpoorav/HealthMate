const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Save user data to JSON file (overwriting)
app.post('/saveUserData', (req, res) => {
    const userData = req.body;
    console.log('Received user data:', userData);

    // Define the path to the JSON file
    const filePath = path.join(__dirname, 'userData.json');

    // Write the user data directly to the file (overwriting existing data)
    fs.writeFile(filePath, JSON.stringify(userData, null, 2), (err) => {
        if (err) {
            console.error('Error saving data:', err);
            return res.status(500).send('Error saving data');
        }

        res.status(200).json({ message: 'User data saved successfully' });
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});