const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const mime = require('mime-types');
const { DocumentAIClient } = require('@google-cloud/documentai');
const { DocumentProcessorServiceClient } = require('@google-cloud/documentai');
const app = express();
const client = new DocumentProcessorServiceClient({
    keyFilename: 'HealthMate/USERPAGE/Home Page/backend/servicekey.json',
    
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, filePath) => {
        const mimeType = mime.lookup(filePath);
        if (mimeType) {
            res.setHeader('Content-Type', mimeType);
        }
    }
}));
app.use('/css', express.static(path.join(__dirname, '../frontend/style.css'))); 
app.use(express.static(path.join(__dirname, '../frontend'))); 

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

// Async helper function for document summarization
async function summarizeDocument(filePath) {
    try {
        // Ensure you have set up Google Cloud credentials
        // You can do this by setting the GOOGLE_APPLICATION_CREDENTIALS environment variable
        // or by passing credentials directly

        // Initialize the Document AI client
        const client = new DocumentProcessorServiceClient();

        // Read the document file
        const fileBuffer = await fs.promises.readFile(filePath);

        // Prepare the request
        const request = {
            name: 'projects/18164070785/locations/us/processors/43d2b1397018f792', // Replace with your actual processor name
            rawDocument: {
                content: fileBuffer,
                mimeType: 'application/pdf', // Adjust based on your file type
            },
        };

        // Process the document
        const [result] = await client.processDocument(request);

        // Extract text
        const text = result.document.text;

        // Generate a simple summary (you might want to implement a more sophisticated summarization)
        const sentences = text.split('.').filter(sentence => sentence.trim().length > 0);
        const summary = sentences.slice(0, 3).join('. ') + '.';

        return summary;
    } catch (error) {
        console.error('Error summarizing document:', error);
        return 'Unable to generate summary';
    }
}

module.exports = { summarizeDocument };


// Upload Document Route
app.post('/upload-document', upload.single('document'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
    
        const filePath = path.join(__dirname, 'uploads', req.file.filename);
        const summary = await summarizeDocument(filePath);
    
        const documentData = {
            id: documents.length + 1,
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            uploadDate: new Date().toISOString(),
            category: req.body.category || 'other',
            summary,
        };
    
        documents.push(documentData);
    
        res.status(200).json({
            message: 'File uploaded successfully',
            document: documentData,
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Error uploading document' });
    }
});

// Get Documents Route
app.get('/get-documents', (req, res) => {
    const category = req.query.category || 'all';
    
    const filteredDocuments = category === 'all' 
        ? documents 
        : documents.filter(doc => doc.category === category);

    res.json(filteredDocuments);
});

// Get Document Summary Route
app.get('/get-document-summary/:id', (req, res) => {
    const documentId = parseInt(req.params.id);
    const document = documents.find((doc) => doc.id === documentId);
  
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
  
    res.json({ summary: document.summary });
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
    try {
        fs.unlinkSync(path.join(__dirname, 'uploads', document.filename));
    } catch (error) {
        console.error('Error deleting file:', error);
    }

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