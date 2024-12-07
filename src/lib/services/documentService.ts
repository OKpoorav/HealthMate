import { ChatOpenAI } from '@langchain/openai';
import { Document } from 'langchain/document';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { DocxLoader } from 'langchain/document_loaders/fs/docx';
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
const model = new ChatOpenAI({
  modelName: 'gpt-4',
  temperature: 0.3,
  openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

export class DocumentService {
  private documents: MedicalDocument[] = [];

  // Supported file types
  private readonly SUPPORTED_TYPES = {
    'application/pdf': 'PDF',
    'image/jpeg': 'JPG',
    'image/png': 'PNG',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX'
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
        throw new Error('Unsupported file type');
      }

      // Create a blob URL for the file
      const url = URL.createObjectURL(file);
      
      // Process document content
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
      throw new Error('Failed to upload document');
    }
  }

  private async extractContent(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      let content = '';

      if (file.type === 'application/pdf') {
        const loader = new PDFLoader(new Blob([arrayBuffer]));
        const docs = await loader.load();
        content = docs.map(doc => doc.pageContent).join(' ');
      } else if (file.type.includes('docx')) {
        const loader = new DocxLoader(new Blob([arrayBuffer]));
        const docs = await loader.load();
        content = docs.map(doc => doc.pageContent).join(' ');
      } else if (file.type.includes('image')) {
        // For images, we'll need to implement OCR
        // This is a placeholder for OCR implementation
        content = 'Image content to be processed with OCR';
      }

      // Split content into manageable chunks
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });

      const chunks = await splitter.createDocuments([content]);
      return chunks.map(chunk => chunk.pageContent).join(' ');
    } catch (error) {
      console.error('Error extracting content:', error);
      throw new Error('Failed to extract document content');
    }
  }

  private async generateInsights(content: string) {
    try {
      const prompt = `Analyze the following medical document content and provide:
1. Document type (MEDICAL_REPORT, PRESCRIPTION, INSURANCE, LAB_RESULT, or OTHER)
2. A brief summary (max 200 words)
3. Relevant category
4. Key tags (max 5)

Content: ${content}`;

      const response = await model.invoke(prompt);
      const analysis = response.content.toString();

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
    // Implement thumbnail generation based on file type
    // For now, return placeholder
    return '/assets/document-thumbnail.png';
  }

  private extractDocumentType(analysis: string): DocumentType {
    // Implement logic to extract document type from AI analysis
    return 'OTHER';
  }

  private extractSummary(analysis: string): string {
    // Implement logic to extract summary from AI analysis
    return analysis;
  }

  private determineCategory(analysis: string): string {
    // Implement logic to determine category from AI analysis
    return 'Uncategorized';
  }

  private extractTags(analysis: string): string[] {
    // Implement logic to extract tags from AI analysis
    return [];
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