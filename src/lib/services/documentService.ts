import { getGeminiModel } from '../config/gemini';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

export type DocumentType = 'MEDICAL_REPORT' | 'PRESCRIPTION' | 'INSURANCE' | 'LAB_RESULT' | 'OTHER';

export interface MedicalDocument {
  id: string;
  name: string;
  type: DocumentType;
  fileType: string;
  url: string;
  summary?: string;
  category?: string;
  uploadDate: Date;
  tags: string[];
  size: number;
  thumbnailUrl?: string;
}

// Initialize the AI model for document processing
const model = getGeminiModel();

export class DocumentService {
  private documents: MedicalDocument[] = [];

  // Supported file types
  private readonly SUPPORTED_TYPES = {
    'application/pdf': 'PDF',
    'image/jpeg': 'JPG',
    'image/png': 'PNG',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'text/plain': 'TXT'
  };

  // Document categories
  private readonly CATEGORIES = {
    MEDICAL_REPORT: ['diagnosis', 'examination', 'medical history'],
    PRESCRIPTION: ['medication', 'dosage', 'pharmacy'],
    INSURANCE: ['coverage', 'policy', 'claim'],
    LAB_RESULT: ['blood test', 'urine test', 'imaging'],
  };

  async uploadDocument(file: File): Promise<MedicalDocument> {
    try {
      // Validate file type
      if (!this.SUPPORTED_TYPES[file.type]) {
        throw new Error(`Unsupported file type: ${file.type}`);
      }

      // Validate file size (max 10MB)
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > MAX_FILE_SIZE) {
        throw new Error('File size exceeds 10MB limit');
      }

      // Create a blob URL for the file
      const url = URL.createObjectURL(file);
      
      // Extract text content from the file
      const content = await this.extractContent(file);
      
      // Generate AI insights
      const insights = await this.generateInsights(content);

      const document: MedicalDocument = {
        id: Date.now().toString(),
        name: file.name,
        type: insights.type,
        fileType: this.SUPPORTED_TYPES[file.type],
        url,
        summary: insights.summary,
        category: insights.category,
        uploadDate: new Date(),
        tags: insights.tags,
        size: file.size,
        thumbnailUrl: await this.generateThumbnail(file),
      };

      this.documents.push(document);
      return document;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to upload document');
    }
  }

  private async extractContent(file: File): Promise<string> {
    try {
      let content = '';
      
      if (file.type === 'text/plain') {
        content = await file.text();
      } else if (file.type.includes('image')) {
        content = 'Image document - content extraction not yet implemented';
      } else {
        const text = await this.readFileAsText(file);
        content = text || 'Failed to extract text content';
      }

      // Split content into manageable chunks if it's too long
      if (content.length > 1000) {
        const splitter = new RecursiveCharacterTextSplitter({
          chunkSize: 1000,
          chunkOverlap: 200,
        });

        const chunks = await splitter.createDocuments([content]);
        return chunks.map(chunk => chunk.pageContent).join(' ');
      }

      return content;
    } catch (error) {
      console.error('Error extracting content:', error);
      return 'Failed to extract content from document';
    }
  }

  private async readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target?.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  }

  private async generateInsights(content: string) {
    try {
      // Limit content length for the AI model
      const MAX_CONTENT_LENGTH = 5000;
      const truncatedContent = content.length > MAX_CONTENT_LENGTH 
        ? content.slice(0, MAX_CONTENT_LENGTH) + '...'
        : content;

      const prompt = `Analyze the following medical document content and provide:
1. Document type (MEDICAL_REPORT, PRESCRIPTION, INSURANCE, LAB_RESULT, or OTHER)
2. A brief summary (max 200 words)
3. Relevant category
4. Key tags (max 5)

Content: ${truncatedContent}`;

      const result = await model.generateContent(prompt);
      if (!result || !result.response) {
        throw new Error('Failed to generate AI insights');
      }

      const response = await result.response;
      const analysis = response.text();

      if (!analysis) {
        throw new Error('Empty response from AI model');
      }

      // Parse the AI response
      const type = this.extractDocumentType(analysis);
      const summary = this.extractSummary(analysis);
      const category = this.determineCategory(analysis);
      const tags = this.extractTags(analysis);

      return { type, summary, category, tags };
    } catch (error) {
      console.error('Error generating insights:', error);
      return {
        type: 'OTHER' as DocumentType,
        summary: 'Failed to generate summary',
        category: 'Uncategorized',
        tags: [],
      };
    }
  }

  private async generateThumbnail(file: File): Promise<string> {
    try {
      if (file.type.includes('image')) {
        return URL.createObjectURL(file);
      }
      // For non-image files, return a default thumbnail based on file type
      const fileExtension = this.SUPPORTED_TYPES[file.type].toLowerCase();
      return `/assets/document-thumbnails/${fileExtension}.png`;
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      return '/assets/document-thumbnails/default.png';
    }
  }

  private extractDocumentType(analysis: string): DocumentType {
    try {
      const types: DocumentType[] = ['MEDICAL_REPORT', 'PRESCRIPTION', 'INSURANCE', 'LAB_RESULT'];
      const analysisUpper = analysis.toUpperCase();
      for (const type of types) {
        if (analysisUpper.includes(type)) {
          return type;
        }
      }
      return 'OTHER';
    } catch {
      return 'OTHER';
    }
  }

  private extractSummary(analysis: string): string {
    try {
      const summaryMatch = analysis.match(/summary:?\s*(.*?)(?=\n|$)/i);
      return summaryMatch ? summaryMatch[1].trim() : 'No summary available';
    } catch {
      return 'No summary available';
    }
  }

  private determineCategory(analysis: string): string {
    try {
      const analysisLower = analysis.toLowerCase();
      for (const [category, keywords] of Object.entries(this.CATEGORIES)) {
        if (keywords.some(keyword => analysisLower.includes(keyword))) {
          return category;
        }
      }
      return 'Uncategorized';
    } catch {
      return 'Uncategorized';
    }
  }

  private extractTags(analysis: string): string[] {
    try {
      const tagsMatch = analysis.match(/tags:?\s*(.*?)(?=\n|$)/i);
      if (tagsMatch) {
        return tagsMatch[1]
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0)
          .slice(0, 5);
      }
      return ['untagged'];
    } catch {
      return ['untagged'];
    }
  }

  getDocuments(): MedicalDocument[] {
    return this.documents;
  }

  getDocument(id: string): MedicalDocument | undefined {
    return this.documents.find(doc => doc.id === id);
  }

  deleteDocument(id: string): void {
    const index = this.documents.findIndex(doc => doc.id === id);
    if (index !== -1) {
      URL.revokeObjectURL(this.documents[index].url);
      if (this.documents[index].thumbnailUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(this.documents[index].thumbnailUrl);
      }
      this.documents.splice(index, 1);
    }
  }

  searchDocuments(query: string): MedicalDocument[] {
    const lowercaseQuery = query.toLowerCase();
    return this.documents.filter(doc =>
      doc.name.toLowerCase().includes(lowercaseQuery) ||
      doc.summary?.toLowerCase().includes(lowercaseQuery) ||
      doc.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  filterDocuments(type?: DocumentType, category?: string): MedicalDocument[] {
    return this.documents.filter(doc =>
      (!type || doc.type === type) &&
      (!category || doc.category === category)
    );
  }
}

export const documentService = new DocumentService(); 