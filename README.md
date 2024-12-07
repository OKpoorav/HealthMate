# HealthMate 🏥

A modern healthcare management platform that revolutionizes how patients and medical professionals interact with health information. Built with React, TypeScript, and powered by AI.

## 🌟 Features

### 🔐 Authentication & User Management
- Secure login and registration system
- Role-based access (Patients/Doctors)
- Profile management
- JWT-based authentication

### 📋 Document Management
- Upload and store various medical documents
- Supported file types: PDF, JPG, PNG, DOCX
- AI-powered document analysis and categorization
- Document preview and download capabilities
- Secure document sharing

### 🤖 AI-Powered Features
- Interactive medical chatbot (GPT-4)
- Automatic document summarization
- Intelligent document categorization
- Health trend analysis
- Personalized health insights

### 📊 Health Tracking
- Real-time health metrics monitoring
- Interactive health trend visualization
- Customizable health dashboards
- Progress tracking and insights

### 👨‍⚕️ Doctor Features
- Patient management dashboard
- Appointment scheduling
- Medical record access
- Patient communication system

### 👤 Patient Features
- Medical record management
- Appointment booking
- Health metric tracking
- Document upload and organization

## 🛠️ Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Chart.js for data visualization
- React Router for navigation

### AI/ML
- OpenAI GPT-4 API
- LangChain for conversation management
- Document analysis capabilities

### State Management
- Zustand for state management
- Persist middleware for data persistence

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

## 🚀 Getting Started

1. Clone the repository
bash
git clone https://github.com/yourusername/healthmate.git
cd healthmate
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
Create a `.env` file in the root directory with the following:
```env
# OpenAI API Key (Required for AI features)
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Optional configurations
VITE_API_URL=your_api_url_here
VITE_STORAGE_URL=your_storage_url_here
```

4. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| VITE_OPENAI_API_KEY | OpenAI API key for AI features | Yes |
| VITE_API_URL | Backend API URL | No |
| VITE_STORAGE_URL | Storage service URL | No |

## 📁 Project Structure

```
src/
├── components/         # Reusable components
│   ├── auth/          # Authentication components
│   ├── chat/          # Chatbot components
│   ├── documents/     # Document management
│   └── shared/        # Shared components
├── pages/             # Page components
│   ├── auth/          # Authentication pages
│   ├── dashboard/     # Dashboard pages
│   └── profile/       # Profile pages
├── lib/               # Utilities and services
│   ├── services/      # API services
│   ├── store/         # State management
│   └── validations/   # Form validations
└── App.tsx            # Root component
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## 📱 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🔒 Security

- All API keys should be stored in environment variables
- Never commit `.env` files to version control
- Use secure HTTPS connections in production
- Implement proper authentication and authorization

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGithub](https://github.com/yourusername)

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- React team
- Tailwind CSS team
- All contributors and supporters
```