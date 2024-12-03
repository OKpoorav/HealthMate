const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files
app.use('/css', express.static(path.join(__dirname, '../frontend/style.css'))); // Serve CSS file
app.use(express.static(path.join(__dirname, '../frontend'))); // Serve frontend files

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB file size limit
    }
});

// Mock database (replace with actual database in production)
const documents = [];

// Upload Document Route
app.post('/upload-document', upload.single('document'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const documentData = {
        id: documents.length + 1,
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        uploadDate: new Date().toISOString(),
        category: req.body.category || 'other'
    };

    documents.push(documentData);

    res.status(200).json({
        message: 'File uploaded successfully',
        document: documentData
    });
});

// Get Documents Route
app.get('/get-documents', (req, res) => {
    const category = req.query.category || 'all';
    
    const filteredDocuments = category === 'all' 
        ? documents 
        : documents.filter(doc => doc.category === category);

    res.json(filteredDocuments);
});

// Delete Document Route
app.delete('/delete-document/:id', (req, res) => {
    const documentId = parseInt(req.params.id);
    const documentIndex = documents.findIndex(doc => doc.id === documentId);

    if (documentIndex === -1) {
        return res.status(404).json({ error: 'Document not found' });
    }

    // Remove file from uploads directory
    const document = documents[documentIndex];
    fs.unlinkSync(path.join(__dirname, 'uploads', document.filename));

    // Remove from documents array
    documents.splice(documentIndex, 1);

    res.json({ 
        message: `Document ${documentId} deleted successfully` 
    });
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'dashboard.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} in your browser`);
});