import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  File, 
  FileText, 
  Image, 
  Trash2, 
  Download, 
  Search,
  Filter,
  Plus,
  X,
  Loader2
} from 'lucide-react';
import { documentService, MedicalDocument, DocumentType } from '@/lib/services/documentService';

interface DocumentCardProps {
  document: MedicalDocument;
  onDelete: (id: string) => void;
  onClick: (doc: MedicalDocument) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, onDelete, onClick }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          {document.fileType === 'PDF' && <FileText className="h-5 w-5 text-red-500" />}
          {document.fileType === 'DOCX' && <File className="h-5 w-5 text-blue-500" />}
          {['JPG', 'PNG'].includes(document.fileType) && <Image className="h-5 w-5 text-green-500" />}
          <h3 className="font-medium text-gray-900 truncate">{document.name}</h3>
        </div>
        <p className="text-sm text-gray-500 mt-1">{document.category}</p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onDelete(document.id)}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
    <div className="mt-2">
      <p className="text-sm text-gray-600 line-clamp-2">{document.summary}</p>
    </div>
    <div className="mt-3 flex flex-wrap gap-2">
      {document.tags.map((tag, index) => (
        <span
          key={index}
          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
        >
          {tag}
        </span>
      ))}
    </div>
    <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
      <span>{new Date(document.uploadDate).toLocaleDateString()}</span>
      <span>{(document.size / 1024 / 1024).toFixed(2)} MB</span>
    </div>
  </motion.div>
);

const DocumentPreview: React.FC<{
  document: MedicalDocument;
  onClose: () => void;
}> = ({ document, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
    >
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">{document.name}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="p-6 overflow-y-auto">
        {document.fileType === 'PDF' || document.fileType === 'DOCX' ? (
          <iframe
            src={document.url}
            className="w-full h-[70vh]"
            title={document.name}
          />
        ) : (
          <img
            src={document.url}
            alt={document.name}
            className="max-w-full h-auto mx-auto"
          />
        )}
      </div>
      <div className="p-4 border-t">
        <h3 className="font-medium mb-2">AI Insights</h3>
        <p className="text-gray-600 mb-4">{document.summary}</p>
        <div className="flex flex-wrap gap-2">
          {document.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  </div>
);

const DocumentManager: React.FC = () => {
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<DocumentType | undefined>();
  const [selectedDocument, setSelectedDocument] = useState<MedicalDocument | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(file =>
        documentService.uploadDocument(file)
      );
      const newDocuments = await Promise.all(uploadPromises);
      setDocuments(prev => [...prev, ...newDocuments]);
    } catch (error) {
      console.error('Error uploading documents:', error);
      // Show error message to user
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = (id: string) => {
    documentService.deleteDocument(id);
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const filteredDocuments = documents
    .filter(doc => 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summary?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(doc => !selectedType || doc.type === selectedType);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Medical Documents</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <select
            value={selectedType || ''}
            onChange={(e) => setSelectedType(e.target.value as DocumentType || undefined)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="MEDICAL_REPORT">Medical Reports</option>
            <option value="PRESCRIPTION">Prescriptions</option>
            <option value="INSURANCE">Insurance</option>
            <option value="LAB_RESULT">Lab Results</option>
          </select>
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isUploading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Upload className="h-5 w-5" />
              )}
              <span>Upload</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onDelete={handleDelete}
              onClick={() => setSelectedDocument(doc)}
            />
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedDocument && (
          <DocumentPreview
            document={selectedDocument}
            onClose={() => setSelectedDocument(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocumentManager; 